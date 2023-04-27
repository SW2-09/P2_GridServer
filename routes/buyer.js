export { buyerRouter };
import { JobQueue } from "../Jobtypes/jobQueue.js";
import { matrix_mult_str } from "../Jobtypes/matrix_multiplication/calcAlgorithm.js";
import { plus_str } from "../Jobtypes/plus/calcPlusAlgorithm.js";
import { createFolder, writeFile } from "../utility.js";
import path from "path";

import express from "express";
import fileUpload from "express-fileupload";

import { Buyer } from "../models/Buyer.js";

const buyerRouter = express.Router();

const calcMax = Math.pow(1500, 3);

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

const dirPath = "./JobData/PendingJobs/";

buyerRouter.use(fileUpload());

buyerRouter.post("/upload", async (req, res) => {
    try {
        let dynamicDirPath = dirPath + req.user.name + "/";
        let jobtype = req.body.jobType;
        let Jobdata;

        switch (
            jobtype // in case the jobtype is matrix multiplication
        ) {
            case "matrixMult": {
                Jobdata = createMatrixMultJob(req.body, req.user.name);
                break;
            }
            case "plus": {
                // in case the jobtype is plus
                Jobdata = createPlusJob(req.body, req.user.name);

                break;
            }
            default: {
                // in case the jobtype is not found
                throw new Error("Jobtype not found");
            }
        }

        let jobInfo = {
            jobID: req.body.jobTitle,
            Des: req.body.jobDescription,
            type: jobtype,
            completed: false,
        };
        //Update DB:
        //console.log(Buyer.findOne({name: req.user.name}))
        await Buyer.findOneAndUpdate(
            { name: req.user.name },
            { $push: { jobs_array: jobInfo } }
        );

        let uploadPath = dynamicDirPath + Jobdata.jobID + ".json";

        //create folder in the PendingJobs folder if not exists, the folder name is the user name
        createFolder(dynamicDirPath);
        //write the file to the new folder created in the PendingJobs folder
        writeFile(uploadPath, Jobdata);
    } catch (error) {
        console.log("Uploading: " + error);
        res.send("Uploading: " + error);
    }
});

buyerRouter.post("/jobinfo", async (req, res) => {
    const buyer = await Buyer.findOne({ name: req.user.name });
    res.json({ jobs: buyer.jobs_array, name: req.user.name });
});

buyerRouter.post("/download", async (req, res) => {
    let relativePath = `JobData/Solutions/${req.user.name}/${req.body.id}.json`;
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
        //Delete from DB
        await Buyer.findOneAndUpdate(
            { name: req.user.name }, //filter
            { $pull: { jobs_array: { jobID: req.body.id } } },
            { new: true }
        );

        // Delete from jobQueue
        JobQueue.removeJob(req.body.id);
    } catch (err) {
        console.log(err);
    }
});

/**
 * function to create a job of type matrix multiplication and enqueue it to the job queue
 * @param {object} jobData object holding the data used to create the job
 * @returns the object holding the data used to create the job
 */
function createMatrixMultJob(jobData, jobOwner) {
    const Jobdata = {
        jobID: jobData.jobTitle,
        Des: jobData.jobDescription,
        type: jobData.jobType,
        arrA: jobData.uploadFile,
        arrB: jobData.uploadFile2,
    };
    let matrix_A = {
        entries: Jobdata.arrA,
        columns: Jobdata.arrA[0].length,
        rows: Jobdata.arrA.length,
    };
    let matrix_B = {
        entries: Jobdata.arrB,
        columns: Jobdata.arrB[0].length,
        rows: Jobdata.arrB.length,
    };

    // adding the job to the job queue
    addMatrixToQue(Jobdata.jobID, Jobdata.type, jobOwner, matrix_A, matrix_B);

    console.log(JobQueue.size);
    console.log(JobQueue.head.numOfTasks);

    return Jobdata;
}

/**
 * function to create a job of type plus and enqueue it to the job queue
 * @param {object} jobData object holding the data for the job
 * @returns the object used to create the job
 */
function createPlusJob(jobData, jobOwner) {
    const Jobdata = {
        jobID: jobData.jobTitle,
        Des: jobData.jobDescription,
        type: jobData.jobType,
        arr: jobData.uploadFile,
    };

    // adding the job to the job queue
    addPlusToQue(Jobdata.jobID, Jobdata.type, jobOwner, Jobdata.arr);

    console.log(JobQueue.size);
    console.log(JobQueue.head.numOfTasks);

    return Jobdata;
}

/**
 * function for adding the matrix multiplication job to the job queue
 * @param {string} jobID the id of the job
 * @param {string} jobType the type of the job
 * @param {matrix} matrix_A the matrix A
 * @param {matrix} matrix_B the matrix B
 */
function addMatrixToQue(jobID, jobType, jobOwner, matrix_A, matrix_B) {
    let ARows = matrix_A.rows;
    let A = matrix_A.entries;

    let arr = divideMatrices(A, matrix_B, ARows);

    // enqueue the job to the job queue
    JobQueue.enQueue(jobID, jobType, jobOwner, matrix_mult_str, matrix_B);
    for (let index = 0; index < arr.length; index++) {
        JobQueue.head.subtaskList.enQueue(
            JobQueue.head.jobId,
            index,
            arr[index]
        );
        JobQueue.head.numOfTasks++;
    }
}

/**
 * function which will enqueue the plus job to the job queue
 * @param {string} jobID the id of the job
 * @param {string} jobType the type of the job
 * @param {array} entries the array which holds the numbers to be added
 */

function addPlusToQue(jobID, jobType, jobOwner, entries) {
    let arr = dividePlus(entries);
    // enqueue the job to the job queue
    JobQueue.enQueue(jobID, jobType, jobOwner, plus_str);

    for (let index = 0; index < arr.length; index++) {
        JobQueue.head.subtaskList.enQueue(
            JobQueue.head.jobId,
            index,
            arr[index]
        );
        JobQueue.head.numOfTasks++;
    }
}

/**
 * recursive function to divide the matrix A into smaller matrices to fit desired calculation sizes for subtasks
 * @param {matrix} A the matrix A
 * @param {matrix} B the matrix B
 * @param {number} ARows the number of rows in the matrix A
 * @returns the array which will hold the sliced matrices of matrix A
 */
function divideMatrices(A, B, ARows) {
    let arr = []; // the array which will hold the sliced matrices of matrix A

    if (ARows * B.rows * B.columns < calcMax) {
        arr.push(A);
        return arr;
    }

    if (ARows < 2) {
        arr.push(A);
        return arr;
    }

    let slicedMatrixA = A.slice(0, Math.floor(A.length / 2));
    let slicedMatrixA2 = A.slice(Math.floor(A.length / 2), A.length);

    // Concatenate the returned arrays from the recursive calls
    arr = arr.concat(
        divideMatrices(slicedMatrixA, B, Math.floor(ARows / 2)),
        divideMatrices(slicedMatrixA2, B, Math.floor(ARows / 2))
    );
    return arr;
}

/**
 * function to divide the array of entries into smaller arrays to fit desired calculation sizes for subtasks
 * @param {array} entries the array holding the entries to be added toghether
 * @returns new array of smaller subtasks
 */

function dividePlus(entries) {
    let arr = []; // the array which will hold the smaller problems
    let index = 0;
    for (index; 1 < entries.length; index++) {
        arr[index] = [];
        arr[index][0] = entries.pop();
        arr[index][1] = entries.pop();
    }
    if (entries.length == 1) {
        arr[index] = [];
        arr[index][0] = entries.pop();
        arr[index][1] = 0;
    }
    return arr;
}
