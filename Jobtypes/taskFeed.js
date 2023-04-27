export { subtaskFeeder, queueEmpty };

import {Worker} from "../models/Workers.js";
import { createFolder, writeFile } from "../utility.js";
import { matrix_mult } from "./matrix_multiplication/Partitioner.js";
import { matrix_A, matrix_B } from "./matrix_multiplication/matrixSplit.js";
import { Buyer } from "../models/Buyer.js";

//token for signifying that the queue is empty
let queueEmpty = "empty";
let timeer = Date.now();

// && JobQueue.tail.numOfTasks === JobQueue.tail.numOfSolutions)

/**
 * function for feeding the worker with a subtask
 * @param JobQueue - The queue of all jobs submitted by buyers
 * @param workerPack - The package of data to be sent to the worker
 */
function subtaskFeeder(JobQueue) {
    if (JobQueue.tail === null) {
        return null;
    } //if the queue is empty
    let currentJob = JobQueue.tail;
    
    if (currentJob.subtaskList.tail === null) {
        //if there are no more subtasks in the subtask list
        console.log("No more subtasks to do. Checking pending list.");
        let failedJob = checkPendingList(currentJob.pendingList);
        console.log("-------------------")
        console.log(currentJob.numOfTasks)
        console.log(currentJob.numOfSolutions)
        console.log("-------------------")
        if (
            failedJob === null &&
            currentJob.numOfTasks === currentJob.numOfSolutions
        ) {
            //if the job is done
            console.log("Job done!");
            jobDone(JobQueue.tail); //send the solutions to the buyer DOES NOT DO SO YET
            console.log("job done and finished")
            JobQueue.deQueue(); //remove the job from the queue
            console.log("JobQueue updated to size: " + JobQueue.size);
            currentJob = JobQueue.tail; //set the current job to the new tail
            if (currentJob === null) {
                //if the queue is empty
                return null;
            }
        } else if (failedJob !== null) {
            //if there are failed subtasks
            console.log("Job not done yet!");
           
            let workerPack = {
                //create a package to send to the worker
                jobId: currentJob.jobId,
                jobType: currentJob.jobType,
                alg: currentJob.alg,
                taskId: failedJob.taskId,
                commonData: currentJob.commonData,
                data: failedJob.data,
            };
            //set the send time of the subtask to know when the task is outdated
            failedJob.sendTime = Date.now();
            console.log(
                "sending job: " +
                    workerPack.jobId +
                    " task: " +
                    workerPack.taskId +
                    " to worker \n"
            );
            return workerPack;

        }
        else{ //if there are no failed subtasks
            if (currentJob.previous !== null){
            currentJob = currentJob.previous; //set the current job to the next job in the queue

            }
        }
    }

    if ((JobQueue.size < 0)) {
        //if there are no jobs in the queue
        console.log("No work to do. Waiting for new job.");
        return 0;
    }
    if (currentJob.subtaskList.tail !== null) {
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
    return null; //if there are no more subtasks to do
}

/**
 * Function looking through the pending list of a job and checking if any of the tasks are outdated.
 * @param {linkedList} pending is the pending list of the current job
 * @returns Null if the list is empty or there are no outdated tasks
 *          returns an outdated task if there is one
 */
function checkPendingList(pending) {
    if (pending.tail === null) {
        console.log("failedjob = null")
        return null;    //if the list is empty

    }
    let tail = pending.tail;
    let recent = true;
    while (recent && tail !== null) {
        if ((Date.now() - tail.sendTime) > 30000) {
            //if the task is outdated (30 seconds)
            
            return tail;   //if the task is outdated
        }
        tail = tail.previous;
    }
    console.log("failedjob = null")
    return null; //if there are no outdated tasks
}

/**
 * Function called when a job is done. Checks if the solutions are correct.
 * @param { job class} job is the job that is done
 */

async function jobDone(job){
    let Solution = [];
    let workerArr = [];
    let final;
    
    if (job.jobType === "matrixMult"){ //if the job is a matrix multiplication job
        final = [];

        job.solutions.forEach(element => { //concatenates the solutions into one array to combine matrix
            console.log(element);
            workerArr.push({workerId: element.workerId, computed: element.workerSolutions.length});
            
            element.workerSolutions.forEach(e => {
                Solution[e.taskId] = e.solution
            });
        });
        countWork(workerArr);

        Solution.forEach(e => {
            e.forEach(i => {
                final.push(i);
            });
        });
    }
    else if (job.jobType === "plus"){

        job.solutions.forEach(element => { 
            workerArr.push({workerId: element.workerId, computed: element.workerSolutions.length});
            for (let index = 0; index < element.workerSolutions.length; index++) {
              Solution[element.workerSolutions[index].taskId] = element.workerSolutions[index].solution[0];
            }
        });
        countWork(workerArr);
       
        final = 0;
        Solution.forEach(e => {
            final += e;
        });
    }

    //path for file
    let path = "./JobData/Solutions/" + job.jobOwner + "/";

    createFolder(path); //creates a folder for the buyer

    let filename = path + job.jobId + ".json"; //creates a filename for the solution

    writeFile(filename, Solution); //writes the solution to a file


    //Update the job.completed in mongoDB
    await Buyer.findOneAndUpdate(
        { name: job.jobOwner }, //filter
        { $set: { "jobs_array.$[element].completed": true } }, //Update
        { arrayFilters: [{ "element.jobID": job.jobId }] } //Arrayfiler
    );
}

/**
 * function used to update the worker database with the amount of work they have done
 * @param {array} contributors list of the workers that contributed to the job
 */
function countWork(contributors){
    console.log("counting work");
    contributors.forEach(element => {

        Worker.findOne({ workerId: element.workerId }).then((worker) => {
            if (worker) { //worker exists
              //worker exists
              let old = worker["jobs_computed"];
              let combined = old + element.computed;
              worker["jobs_computed"] = combined;
              worker.save();
            } 
            else { //worker does not exist
              const newWorker = new Worker({
                workerId: element.workerId,
                jobs_computed: element.computed,
              });
              newWorker.save();
            }
        });
        console.log(element.workerId);
        console.log(element.computed);
    }); 
    console.log("done counting work");
  }

