export{subtaskFeeder, queueEmpty};
import { matrix_mult } from "./matrix_multiplication/Partitioner.js";
import { matrix_A,matrix_B } from "./matrix_multiplication/matrixSplit.js";
import { Buyer } from "../models/Buyer.js";

//token for signifying that the queue is empty
let queueEmpty="empty";

// && JobQueue.tail.numOfTasks === JobQueue.tail.numOfSolutions)

/**
 * function for feeding the worker with a subtask
 * @param JobQueue - The queue of all jobs submitted by buyers
 * @param workerPack - The package of data to be sent to the worker
 */
function subtaskFeeder(JobQueue){
    if (JobQueue.tail === null){ return null;}//if the queue is empty
    let currentJob = JobQueue.tail;
    if (currentJob.subtaskList.tail=== null) { //if there are no more subtasks in the subtask list
        console.log("No more subtasks to do. Checking pending list.")
        let failedJob = checkPendingList(currentJob.pendingList);
        if (failedJob === null && currentJob.numOfTasks === currentJob.numOfSolutions){//if the job is done
            console.log("Job done!")
            jobDone(JobQueue.tail); //send the solutions to the buyer DOES NOT DO SO YET
            JobQueue.deQueue(); //remove the job from the queue
            console.log("JobQueue updated to size: " + JobQueue.size)
            currentJob = JobQueue.tail; //set the current job to the new tail
        }
        else if (failedJob !== null){ //if there are failed subtasks
            console.log("Job not done yet!")
            console.log("currentJob: " + currentJob.jobId + " task: " + currentJob.pendingList.tail.taskId)
            let workerPack={ //create a package to send to the worker
                jobId: currentJob.jobId,
                jobType: currentJob.jobType,
                alg: currentJob.alg,
                taskId: currentJob.pendingList.tail.taskId,
                commonData: currentJob.commonData,
                data: currentJob.pendingList.tail.data,
            }
            //set the send time of the subtask to know when the task is outdated
            currentJob.pendingList.head.sendTime = Date.now(); 
            console.log("sending job: " + workerPack.jobId + " task: " + workerPack.taskId + " to worker \n")
            return workerPack;
        }
        else{ //if there are no failed subtasks
            if (currentJob.previous !== null){
            currentJob = currentJob.previous; //set the current job to the next job in the queue
            
            }
            // let currentJob=JobQueue.tail.previous;
            // let workerPack={
            //     jobId: currentJob.jobId,
            //     alg: currentJob.alg,
            //     taskId: currentJob.subtaskList.tail.taskId,
            //     matrixB: currentJob.matrixB,
            //     matrixA: currentJob.subtaskList.tail.matrixA,
            // }
            // currentJob.pendingList.enQueue(currentJob.jobId,currentJob.subtaskList.tail.taskId);
            // currentJob.pendingList.head.matrixA = currentJob.subtaskList.tail.matrixA;
            // currentJob.pendingList.head.sendTime = Date.now();
            // currentJob.subtaskList.deQueue();
            // console.log("sending job: " + workerPack.jobId + " task: " + workerPack.taskId + " to worker \n")
            // return workerPack;
        }
    }

    if(!(JobQueue.size > 0)){ //if there are no jobs in the queue
        console.log("No work to do. Waiting for new job.");
        return 0;
    }
    if (currentJob.subtaskList.tail !== null) {
        let workerPack={ //create a package to send to the worker
            jobId: currentJob.jobId,
            jobType: currentJob.jobType,
            alg: currentJob.alg,
            taskId: currentJob.subtaskList.tail.taskId,
            commonData: currentJob.commonData,
            data: currentJob.subtaskList.tail.data,
        }
        currentJob.pendingList.enQueue(currentJob.jobId,currentJob.subtaskList.tail.taskId,currentJob.subtaskList.tail.data); //add the subtask to the pending list
         //add the matrixA to the job in the pending list
        currentJob.pendingList.head.sendTime = Date.now(); //set the send time of the subtask to know when the task is outdated
        currentJob.subtaskList.deQueue(); //remove the subtask from the subtask list
        console.log("sending job: " + workerPack.jobId + " task: " + workerPack.taskId + " to worker \n")
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
function checkPendingList(pending){
    if (pending.head === null) {
        console.log(" null failed job: ")
        return null;    //if the list is empty
    }
    let head = pending.head;
    let recent = true;
    while (recent && head !== null) {
        if (Date.now() - head.sendTime > 10000){ 
            //checking whether it is longer than 120 seconds since the task was sent
            console.log("failed job: " + head.jobId + " task: " + head.taskId)
            return head;   //if the task is outdated
        }
        head = head.next
    }
    console.log("null failed job2: " + pending.head.jobId + " task: " + pending.head.taskId)
    return null; //if there are no outdated tasks
}

/**
 * Function called when a job is done. Checks if the solutions are correct.
 * @param { job class} job is the job that is done
 */
function jobDone(job){
    console.log(job.solutions)
    console.log(job.numOfTasks)
    
    if (job.jobType === "matrixMult"){ //if the job is a matrix multiplication job
        let Solution = [];
        job.solutions.forEach(element => { //concatenates the solutions into one array to combine matrix
            Solution = Solution.concat(element);
        });
        console.log("Solution: " + Solution)
    }
    else if (job.jobType === "plus"){
        let Solution = 0;
        job.solutions.forEach(element => { //concatenates the solutions into one array to combine matrix
            Solution += element;
        });
        console.log("Solution: " + Solution)
    }

    //logs whether the job was done correctly or not THIS SHOULD BE REMOVED WHEN THE ALGORITHM IS DONE
    // if (JSON.stringify(Solution) === JSON.stringify(matrix_mult(matrix_A.entries,matrix_B.entries))){
    //     console.log("Job done correctly! HUSK AT FJERNE");
        
    // }
    // else{
    //     console.log("Job NOT done correctly! HUSK AT FJERNE");
    // }
}