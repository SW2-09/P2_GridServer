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

const subtaskTimeout = 60000; // 60 seconds

// && JobQueue.tail.numOfTasks === JobQueue.tail.numOfSolutions)

/**
 * Feeds subtasks to a worker. Procseeses the current job in the queue
 * handling cases such as empty queues, completed-/failed jobs and more.
 *
 * @returns {object|null} The subtask to be assiged to the worker, or `null` if the subtask-queue is empty.
 */
function subtaskFeeder() {
    if (isJobQueueEmpty()) {
        //if the queue is empty
        return null;
    }
    let currentJob = FirstJobInQueue(); //the current job is the first job in the queue

    if (isSubtaskQueueEmpty(currentJob)) {
        //if there are no more subtasks in the subtask list
        console.log("----------------------------------------");
        console.log("No more subtasks to do. Checking pending list.");
        console.log("----------------------------------------");
        let failedSubtask = checkForFailedSubtask(currentJob.pendingList);

        if (isThereFailedSubtasks(failedSubtask)) {
            //if there are failed subtasks
            return assignFailedSubtask(currentJob, failedSubtask); //assign the failed subtask to a worker
        } else if (
            !isThereFailedSubtasks(failedSubtask) &&
            !isJobDone(currentJob)
        ) {
            // if no subtasks failed and the job is not done
            //currentJob = nextJobInQueue(currentJob);//update the current job to the next job in the queue

            if (onlyJobInQueue(currentJob)) {
                // if the current job is the only job in the queue
                return null; //there are no more jobs to do
            } else {
                //if there are more jobs in the queue
                currentJob = nextJobInQueue(currentJob); //update the current job to the next job in the queue
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

    if (!isSubtaskQueueEmpty(currentJob)) {
        //if there are subtasks to do
        return assignNewSubtask(currentJob);
    }

    return null; //if there are no more subtasks to do
}

/**
 * Looking through the pending list of a job for any tasks that are outdated (timed out).
 *
 * @param {linkedList} pending - The pending list of the current job.
 * @returns {object|null} The first encountered outdated subtask or `null` if the list is empty or have no outdated tasks.
 */
function checkForFailedSubtask(pending) {
    if (pending.tail === null) {
        return null; //if the list is empty
    }
    let tail = pending.tail;
    let recent = true;
    while (recent && tail !== null) {
        if (Date.now() - tail.sendTime > subtaskTimeout) {
            //if the task is outdated (60 seconds)
            serverdata.failedjobs++;
            tail.sendTime = Date.now();
            return tail; //if the task is outdated
        }
        tail = tail.previous;
    }
    return null; //if there are no outdated tasks
}

/**
 * When a job is completed this function handles the operations to be done.
 * This includes updating the job queue, combining results, counting worker array,
 * writing results to a file, deleting pending file, and updating the database.
 *
 * @param {Job} job - The job that is completed.
 */
async function jobDone(job) {    
    let finalResult;
    let tempjob = job;
    updateQueue(job.jobId); //Removes the concluded job from the jobqueue

    switch (tempjob.jobType) {
        case "matrixMult": {
            finalResult = combineMatrixResult(tempjob);
            break;
        }
        case "plus": {
            finalResult = combinePlusResult(tempjob);
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

    let filename = path + tempjob.jobId + ".json"; //creates a filename for the solution

    writeFile(filename, finalResult.final); //writes the solution to a file
    
    deletePendingfile(tempjob.jobId); //deletes the pending file

    //Update the job.completed in mongoDB
    await Buyer.findOneAndUpdate(
        { name: tempjob.jobOwner }, //filter
        { $set: { "jobs_array.$[element].completed": true } }, //Update
        { arrayFilters: [{ "element.jobId": tempjob.jobId }] } //Arrayfiler
    );
    let completiontime = (Date.now() - tempjob.Starttime) / 1000;
    console.log("----------------------------------------");
    console.log("job done and finished");
    console.log("Completion time: " + completiontime);
    console.log("----------------------------------------");
}

/**
 * Update the worker database with the amount of work each worker has done.
 *
 * @param {Array} contributors - List of the workers that contributed to the job
 */
function countWork(contributors) {
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
    });
}

/**
 * Deletes the pending file of a specific job.
 *
 * @param {string} jobId - The ID of the job to be deleted.
 */
function deletePendingfile(jobId) {
    let path = "./JobData/ActiveJobs/" + jobId + ".json";
    fs.unlink(path, (err) => {
        if (err) {
            console.log("An attempt was made to delete a file");
            console.log(err);
        }
    });
}

/**
 * Checks for any pending jbos and adds the first found job to the active jobs queue.
 * If there's still room in the JobQueue it recursively checks for more pending jobs.
 * Default dir is `./JobData/PendingJobs/`
 */
function checkForPendingJobs() {
    let PendingFolder = fs.readdirSync("./JobData/PendingJobs/");
    if (PendingFolder.length === 0) {
        return;
    }

    let firstEntry = PendingFolder[0];

    let path = "./JobData/PendingJobs/" + firstEntry;
    let jobParsed = JSON.parse(fs.readFileSync(path));

    let jobtype = jobParsed.type;
    
    addJobToQue(jobtype, jobParsed);

    fs.renameSync(path, "./JobData/ActiveJobs/" + jobParsed.jobId + ".json");
    if (JobQueue.size < JobQueue.MaxSize) {
        checkForPendingJobs();
    }
}

/**
 * Assigns a new subtask from the `currentJob` the a worker.
 * Then creates a worker-package with relevant job and task data, adds the subtask to the pending list queue,
 * and removes it from the subtask list.
 *
 * @param {object} currentJob - The current job object.
 * @return {object} The worker-package to be sent to the worker.
 */
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
    console.log("--------------------------------------->");
    console.log(
        "sending job: " +
            workerPack.jobId +
            " task: " +
            workerPack.taskId +
            " to worker"
    );
    console.log("--------------------------------------->");
    return workerPack;
}

/**
 * Assigns a failed subtask to the worker.
 *
 * @param {object} currentJob - The job object.
 * @param {object} failedSubtask - The failed subtask object.
 * @returns {object} The new worker-pack for the worker.
 */
function assignFailedSubtask(currentJob, failedSubtask) {
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
/**
 * Checks if job queue is empty
 *
 * @returns {boolean} `true` if the job queue is empty, `false` otherwise.
 */
function isJobQueueEmpty() {
    if (JobQueue.tail === null) {
        return true;
    } else return false;
}

/**
 * Determines if the job is completed.
 *
 * @param {object} job - The job object.
 * @returns {boolean} `true` if the job is done, `false` otherwise.
 */
function isJobDone(job) {
    if (
        job.subtaskList.tail === null &&
        job.pendingList.tail === null &&
        job.numOfTasks === job.numOfSolutions
    ) {
        return true;
    } else return false;
}
/**
 * Checks if job queue is full.
 *
 * @returns {boolean} `true` if the job queue is full, `false` otherwise.
 */
function jobQueueFull() {
    if (JobQueue.size === JobQueue.MaxSize) {
        return true;
    } else return false;
}

/**
 * @returns {object} The first job object in the queue.
 */
function FirstJobInQueue() {
    let currentJob = JobQueue.tail;
    return currentJob;
}

/**
 * Updates the job queue by removing a job and checks for any pending jobs.
 *
 * @param {string} jobId - The ID of the job to be removed.
 */
function updateQueue(jobId) {
    JobQueue.removeJob(jobId);
    console.log("----------------------------------------")
    console.log("JobQueue updated to size: " + JobQueue.size);
    console.log("----------------------------------------")


    if (!jobQueueFull()) {
        //if the queue is not full check for pending jobs
        console.log("----------------------------------------")
        console.log("JobQueue is no longer full checking for pending jobs");
        console.log("----------------------------------------")
        checkForPendingJobs(JobQueue); //add pending jobs to the queue
    }
}

/**
 * Check if the job is the only one in the queue.
 *
 * @param {Job} job - The job object
 * @returns {boolean} `true` if the job is the only in the queue, `false` otherwise.
 */
function onlyJobInQueue(job) {
    if (job.previous === null && job.next === null) {
        return true;
    } else return false;
}

/**
 * Checks if there's any failed subtasks.
 *
 * @param {array} failedSubtask - The pending list
 * @returns
 */
function isThereFailedSubtasks(failedSubtask) {
    if (failedSubtask === null) {
        return false;
    } else return true;
}

/**
 * Checks if the subtask queue is empty
 *
 * @param {Job} job - The object of the job.
 * @returns {boolean} `true` if empty, `false` otherwise.
 */
function isSubtaskQueueEmpty(job) {
    if (job.subtaskList.tail === null) {
        return true;
    } else return false;
}

/**
 * Gets the next job in the queue.
 *
 * @param {Job} job - The job object
 * @returns The next job.
 */
function nextJobInQueue(job) {
    let nextJob = job.previous;
    return nextJob;
}
