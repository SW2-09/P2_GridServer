export { buyerRouter };

import { checkForPendingJobs } from "../Jobtypes/taskFeed.js";
import { JobQueue } from "../Jobtypes/jobQueue.js";
import { createFolder, writeFile } from "../utility.js";
import path from "path";
import { sanitize } from "../utility.js";
import fs from "fs";
import { createMatrixMultJob } from "../Jobtypes/matrix_multiplication/jobCreateMatrixMult.js";
import { createPlusJob } from "../Jobtypes/plus/jobCreatePlus.js";

import express from "express";
import fileUpload from "express-fileupload";

import { Buyer } from "../models/Buyer.js";

const buyerRouter = express.Router();

/* ********************** *
 *    Logout handling     *
 * ********************** */
buyerRouter.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

/* TODO LIST:
 * 1. Maybe upload should be async?
 */

/* ********************** *
 *      File upload       *
 * ********************** */

const pathActiveJobs = "./JobData/ActiveJobs/";
const pathPendingJobs = "./JobData/PendingJobs/";

buyerRouter.use(fileUpload());

buyerRouter.post("/upload", async (req, res) => {
    let dirPath = "";
    if (JobQueue.size >= JobQueue.MaxSize) {
        dirPath = pathPendingJobs;
    } else {
        dirPath = pathActiveJobs;
    }

    try {
        const name = sanitize(req.user.name);
        const jobTitle = sanitize(req.body.jobTitle);
        const jobId = sanitize(req.body.jobId);
        console.log("Uploading: " + jobId);
        const jobDescription = sanitize(req.body.jobDescription);
        let jobtype = req.body.jobType;
        let Jobdata;
        let dataObject = {
            jobTitle: jobTitle,
            jobId: jobId,
            jobDescription: jobDescription,
            jobType: jobtype,
            completed: false,
            uploadFile: req.body.uploadFile,
            uploadFile2: req.body.uploadFile2,
        };

        switch (jobtype) {
            case "matrixMult": {
                // in case the jobtype is matrix multiplication
                Jobdata = createMatrixMultJob(dataObject, name, JobQueue);
                break;
            }
            case "plus": {
                // in case the jobtype is plus

                Jobdata = createPlusJob(dataObject, name, JobQueue);

                break;
            }
            default: {
                // in case the jobtype is not found
                throw new Error("Jobtype not found");
            }
        }

        let jobInfo = {
            jobTitle: jobTitle,
            jobId: jobId,
            Des: jobDescription,
            type: jobtype,
            completed: false,
        };
        //Update DB:
        await Buyer.findOneAndUpdate(
            { name: name },
            { $push: { jobs_array: jobInfo } }
        );

        let uploadPath = dirPath + jobInfo.jobId + ".json";

        //create folder in the PendingJobs folder if not exists, the folder name is the user name
        createFolder(dirPath);
        //write the file to the new folder created in the PendingJobs folder

        writeFile(uploadPath, Jobdata);

        res.send("File uploaded to: " + uploadPath);
    } catch (error) {
        console.log("Uploading: " + error);
        res.send("Uploading: " + error);
    }
});

buyerRouter.post("/jobinfo", async (req, res) => {
    const name = sanitize(req.user.name);
    const buyer = await Buyer.findOne({ name: name });
    res.json({ jobs: buyer.jobs_array, name: name });
});

buyerRouter.post("/download", async (req, res) => {
    const name = sanitize(req.user.name);
    const id = sanitize(req.body.id);
    let relativePath = `JobData/Solutions/${name}/${id}.json`;
    let absolutePath = path.resolve(relativePath);
    res.sendFile(absolutePath, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("solution-file was send");
        }
    });
});
// Delete Job
buyerRouter.post("/delete", async (req, res) => {
    try {
        const name = sanitize(req.user.name);
        const id = sanitize(req.body.id);
        //Delete from DB
        const jobOwner = await Buyer.findOne({ "jobs_array.jobId": id });
        if (jobOwner.name !== name) {
            return res
                .status(401)
                .json({ message: "You are not the owner of this job" });
        }

        await Buyer.findOneAndUpdate(
            { name: name }, //filter
            { $pull: { jobs_array: { jobId: id } } },
            { new: true }
        );

        // Delete from jobQueue
        JobQueue.removeJob(id);
        checkForPendingJobs();

        // Delete from directory
        let absolutePathSolutions = path.resolve(
            `JobData/Solutions/${name}/${id}.json`
        );
        let absolutePathPending = path.resolve(
            `JobData/PendingJobs/${id}.json`
        );
        if (!fs.existsSync(absolutePathPending)) {
            absolutePathPending = path.resolve(`JobData/ActiveJobs/${id}.json`);
        }

        if (fs.existsSync(absolutePathPending)) {
            fs.unlink(absolutePathPending, (err) => {
                if (err) {
                    console.log("An attempt was made to delete a file");
                    console.log(err);
                }
            });
        }
        if (fs.existsSync(absolutePathSolutions)) {
            fs.unlink(absolutePathSolutions, (err) => {
                if (err) {
                    console.log("An attempt was made to delete a file");
                    console.log(err);
                }
            });
        }

        res.json({ message: "Job deleted" });
    } catch (err) {
        console.log(err);
    }
});
