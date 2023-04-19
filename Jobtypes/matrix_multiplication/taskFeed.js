export{subtaskFeeder, queueEmpty};
import { matrix_mult } from "./Partitioner.js";
import { matrix_A,matrix_B } from "./matrixSplit.js";
import { Buyer } from "../../models/Buyer.js";


//token for signifying that the queue is empty
let queueEmpty="empty";

// && JobQueue.tail.numOfTasks === JobQueue.tail.numOfSolutions)

/**
 * function for feeding the worker with a subtask
 * @param JobQueue - The queue of all jobs submitted by buyers
 * @param workerPack - The package of data to be sent to the worker
 */
function subtaskFeeder(JobQueue){
    let currentJob = JobQueue.tail;
    if (currentJob.subtaskList.tail=== null) {
        console.log("No more subtasks to do. Checking pending list.")
        let failedJob = checkPendingList(currentJob.pendingList);
        if (failedJob === null && currentJob.numOfTasks === currentJob.numOfSolutions){//if the job is done
            console.log("Job done!")
            jobDone(JobQueue.tail);
            JobQueue.deQueue();
            console.log("JobQueue updated to size: " + JobQueue.size)
            currentJob = JobQueue.tail;
        }
        else if (failedJob !== null){
            console.log("Job not done yet!")
            console.log("currentJob: " + currentJob.jobId + " task: " + currentJob.pendingList.tail.taskId)
            let workerPack={
                jobId: currentJob.jobId,
                alg: currentJob.alg,
                taskId: currentJob.pendingList.tail.taskId,
                matrixB: currentJob.matrixB,
                matrixA: currentJob.pendingList.tail.matrixA,
            }
            currentJob.pendingList.head.sendTime = Date.now();
            console.log("sending job: " + workerPack.jobId + " task: " + workerPack.taskId + " to worker \n")
            return workerPack;
        }
        else{
            if (currentJob.previous !== null){
            currentJob = currentJob.previous;
            console.log("herforbi");
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

    if(!(JobQueue.size > 0)){
        console.log("No work to do. Waiting for new job.");
        return 0;
    }
    console.log("den er her")
    if (currentJob.subtaskList.tail !== null) {
        let workerPack={
            jobId: currentJob.jobId,
            alg: currentJob.alg,
            taskId: currentJob.subtaskList.tail.taskId,
            matrixB: currentJob.matrixB,
            matrixA: currentJob.subtaskList.tail.matrixA,
        }
        console.log("er det her?")
        currentJob.pendingList.enQueue(currentJob.jobId,currentJob.subtaskList.tail.taskId);
        currentJob.pendingList.head.matrixA = currentJob.subtaskList.tail.matrixA;
        currentJob.pendingList.head.sendTime = Date.now();
        currentJob.subtaskList.deQueue();
        console.log("sending job: " + workerPack.jobId + " task: " + workerPack.taskId + " to worker \n")
        return workerPack;
    }
    return null;
}

function checkPendingList(pending){
    if (pending.head === null) {
        console.log(" null failed job: ")
        return null;
    }
    let head = pending.head;
    let recent = true;
    while (recent && head !== null) {
        if (Date.now() - head.sendTime > 10000){
            console.log("failed job: " + head.jobId + " task: " + head.taskId)
            return head;
        }
        head = head.next
    }
    console.log("null failed job2: " + pending.head.jobId + " task: " + pending.head.taskId)
    return null;
}

function jobDone(job){
    let Solution = [];
    job.solutions.forEach(element => {
        Solution = Solution.concat(element);
    });

    if (JSON.stringify(Solution) === JSON.stringify(matrix_mult(matrix_A.entries,matrix_B.entries))){
        console.log("Job done correctly!");
    }
    else{
        console.log("Job NOT done correctly!");
    }
}