export { subtaskFeeder, jobDone };
export { checkForPendingJobs };

import { JobQueue, addJobToQue } from "./jobQueue.js";
import { Worker } from "../models/Workers.js";
import { createFolder, writeFile } from "../utility.js";
import { serverdata } from "../server.js";
import { Buyer } from "../models/Buyer.js";
import { combineMatrixResult } from "./matrix_multiplication/combineMatrixMult.js";
import { combinePlusResult } from "./plus/combinePlus.js";
import fs from "fs";

const subtaskTimeout = 30000; // 30 seconds

// && JobQueue.tail.numOfTasks === JobQueue.tail.numOfSolutions)

/**
 * function for feeding the worker with a subtask
 * @param JobQueue - The queue of all jobs submitted by buyers
 * @param workerPack - The package of data to be sent to the worker
 */
function subtaskFeeder() {
    if (isJobQueueEmpty()) {
        //if the queue is empty
        return null;
    }
    let currentJob = FirstJobInQueue(); //the current job is the first job in the queue

    if (isSubtaskQueueEmpty(currentJob)) {
        //if there are no more subtasks in the subtask list
        console.log("No more subtasks to do. Checking pending list.");
        let failedSubtask = checkForFailedSubtask(currentJob.pendingList);

        if (isThereFailedSubtasks(failedSubtask)) {
            //if there are failed subtasks
            return assignFailedSubtask(currentJob, failedSubtask); //assign the failed subtask to a worker
        } else if (
            !isThereFailedSubtasks(failedSubtask) &&
            !isJobDone(currentJob)
        ) {
            // if no subtasks failed and the job is not done
     currentJob = nextJobInQueue(currentJob);//update the current job to the next job in the queue

            if (onlyJobInQueue(currentJob)) {
                // if the current job is the only job in the queue
                return null; //there are no more jobs to do
            } else {
                //if there are more jobs in the queue
                currentJob = nextJobInQueue; //update the current job to the next job in the queue

            }
        } else if (
            !isThereFailedSubtasks(failedSubtask) &&
            isJobDone(currentJob)
        ) {
            //if no subtasks failed and the job is done
            jobDone(currentJob); //send the solutions to the buyer and remove the job from the queue
            // and update the job queue
            currentJob = FirstJobInQueue(); //update currentJob to the next job in the queue

            if (isJobQueueEmpty()) {
                //if the queue is empty
                return null; //there are no more jobs to do
            }
        }
    }

    if (isJobQueueEmpty()) {
        //no more jobs in the queue
        console.log("No work to do. Waiting for new job.");
        return null;
    }

    if (!isSubtaskQueueEmpty(currentJob)) {
        //if there are subtasks to do
        return assignNewSubtask(currentJob);
    }

    return null; //if there are no more subtasks to do
}

/**
 * Function looking through the pending list of a job and checking if any of the tasks are outdated.
 * @param {linkedList} pending is the pending list of the current job
 * @returns Null if the list is empty or there are no outdated tasks
 *          returns an outdated task if there is one
 */
function checkForFailedSubtask(pending) {
    if (pending.tail === null) {
        console.log("failedSubtask = null");
        return null; //if the list is empty
    }
    let tail = pending.tail;
    let recent = true;
    while (recent && tail !== null) {
        if (Date.now() - tail.sendTime > subtaskTimeout) {
            //if the task is outdated (30 seconds)
            serverdata.failedjobs++;
            tail.sendTime = Date.now();
            return tail; //if the task is outdated
        }
        tail = tail.previous;
    }
    console.log("failedSubtask = null");
    return null; //if there are no outdated tasks
}

/**
 * Function called when a job is done. Checks if the solutions are correct.
 * @param { job class} job is the job that is done
 */
async function jobDone(job) {
    console.log("starting jobDone");
    let finalResult;

    switch (job.jobType) {
        case "matrixMult": {
            finalResult = combineMatrixResult(job);
            break;
        }
        case "plus": {
            finalResult = combinePlusResult(job);
            break;
        }
        default:
            console.log(
                "job type not found - how can an unknown jobType be done?"
            );
            break;
    }

    countWork(finalResult.workerArr);

    //path for file
    let path = "./JobData/Solutions/" + job.jobOwner + "/";

    createFolder(path); //creates a folder for the buyer

    let filename = path + job.jobId + ".json"; //creates a filename for the solution

    writeFile(filename, finalResult.final); //writes the solution to a file
    console.log("kig her");
    console.log(job.jobId);
    deletePendingfile(job.jobId); //deletes the pending file

    //Update the job.completed in mongoDB
    await Buyer.findOneAndUpdate(
        { name: job.jobOwner }, //filter
        { $set: { "jobs_array.$[element].completed": true } }, //Update
        { arrayFilters: [{ "element.jobId": job.jobId }] } //Arrayfiler
    );
    console.log("job done and finished");
    updateQueueAfterJobDone(); //update the queue after the job is done
}

/**
 * function used to update the worker database with the amount of work they have done
 * @param {array} contributors list of the workers that contributed to the job
 */
function countWork(contributors) {
    console.log("counting work");
    contributors.forEach((element) => {
        Worker.findOne({ workerId: element.workerId }).then((worker) => {
            if (worker) {
                //worker exists
                //worker exists
                let old = worker["jobs_computed"];
                let combined = old + element.computed;
                worker["jobs_computed"] = combined;
                worker.save();
            } else {
                //worker does not exist
                const newWorker = new Worker({
                    workerId: element.workerId,
                    jobs_computed: element.computed,
                });
                newWorker.save();
            }
        });

        // console.log(element.workerId);
        // console.log(element.computed);
    });
    console.log("done counting work");
}

function deletePendingfile(jobId) {
    let path = "./JobData/ActiveJobs/" + jobId + ".json";
    fs.unlink(path, (err) => {
        if (err) {
            console.log("An attempt was made to delete a file");
            console.log(err);
        }
    });
}

function checkForPendingJobs() {
    let PendingFolder = fs.readdirSync("./JobData/PendingJobs/");
    if (PendingFolder.length === 0) {
        return;
    }

    let firstEntry = PendingFolder[0];

    let path = "./JobData/PendingJobs/" + firstEntry;
    let jobParsed = JSON.parse(fs.readFileSync(path));

    let jobtype = jobParsed.type;
    console.log(jobtype);
    addJobToQue(jobtype, jobParsed);

    fs.renameSync(path, "./JobData/ActiveJobs/" + jobParsed.jobId + ".json");
    if (JobQueue.size < JobQueue.MaxSize) {
        checkForPendingJobs();
    }
}

function assignNewSubtask(currentJob) {
    let workerPack = {
        //create a package to send to the worker
        jobId: currentJob.jobId,
        jobType: currentJob.jobType,
        alg: currentJob.alg,
        taskId: currentJob.subtaskList.tail.taskId,
        commonData: currentJob.commonData,
        data: currentJob.subtaskList.tail.data,
    };
    currentJob.pendingList.enQueue(
        currentJob.jobId,
        currentJob.subtaskList.tail.taskId,
        currentJob.subtaskList.tail.data
    ); //add the subtask to the pending list
    //add the matrixA to the job in the pending list
    currentJob.pendingList.head.sendTime = Date.now(); //set the send time of the subtask to know when the task is outdated
    currentJob.subtaskList.deQueue(); //remove the subtask from the subtask list
    console.log(
        "sending job: " +
            workerPack.jobId +
            " task: " +
            workerPack.taskId +
            " to worker \n"
    );

    return workerPack;
}

function assignFailedSubtask(currentJob, failedSubtask) {
    console.log("Job not done yet!");

    let workerPack = {
        //create a package to send to the worker
        jobId: currentJob.jobId,
        jobType: currentJob.jobType,
        alg: currentJob.alg,
        taskId: failedSubtask.taskId,
        commonData: currentJob.commonData,
        data: failedSubtask.data,
    };
    //set the send time of the subtask to know when the task is outdated
    //failedJob.sendTime = Date.now();

    console.log(
        "sending job: " +
            workerPack.jobId +
            " task: " +
            workerPack.taskId +
            " to worker \n"
    );
    return workerPack;
}

function isJobQueueEmpty() {
    if (JobQueue.tail === null) {
        return true;
    } else return false;
}

function isJobDone(job) {
    if (
        job.subtaskList.tail === null &&
        job.pendingList.tail === null &&
        job.numOfTasks === job.numOfSolutions
    ) {
        return true;
    } else return false;
}

function jobQueueFull() {
    if (JobQueue.size === JobQueue.MaxSize) {
        return true;
    } else return false;
}

function FirstJobInQueue() {
    let currentJob = JobQueue.tail;
    return currentJob;
}

function updateQueueAfterJobDone() {
    JobQueue.deQueue();
    console.log("JobQueue updated to size: " + JobQueue.size);

    if (!jobQueueFull()) {
        //if the queue is not full check for pending jobs
        console.log("JobQueue is no longer full checking for pending jobs");
        checkForPendingJobs(JobQueue); //add pending jobs to the queue
    }
}

function onlyJobInQueue(job) {
    if (job.previous === null && job.next === null) {
        return true;
    } else return false;
}

function isThereFailedSubtasks(failedSubtask) {
    if (failedSubtask === null) {
        return false;
    } else return true;
}

function isSubtaskQueueEmpty(job) {
    if (job.subtaskList.tail === null) {
        return true;
    } else return false;
}

function nextJobInQueue(job) {
    let nextJob = job.previous;
    return nextJob;
}
