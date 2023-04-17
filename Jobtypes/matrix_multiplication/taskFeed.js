export{subtaskFeeder, queueEmpty};
import { Buyer } from "../models/Buyer.js";


//token for signifying that the queue is empty
let queueEmpty="empty";

/**
 * function for feeding the worker with a subtask
 * @param JobQueue - The queue of all jobs submitted by buyers
 * @param workerPack - The package of data to be sent to the worker
 */
function subtaskFeeder(JobQueue){
    if (JobQueue.tail.subtaskList.tail=== null){
        jobDone(JobQueue.tail);
        JobQueue.deQueue();
    }
    if(!(JobQueue.size > 0)){
        console.log("No work to do. Waiting for new job.");
        return 0;
    }
    let currentJob=JobQueue.tail;
    let workerPack={
        jobId: currentJob.jobId,
        alg: currentJob.alg,
        taskId: currentJob.subtaskList.tail.taskId,
        matrixB: currentJob.matrixB,
        matrixA: currentJob.subtaskList.tail.matrixA,
    }
    JobQueue.tail.subtaskList.deQueue();
    return workerPack;
}

function jobDone(job){
    let Solution = [];
    job.solutions.forEach(element => {
        Solution.concat(element);
    });
    Buyer.findone({name: job.owner}).then((buyer)=>{

    });
}