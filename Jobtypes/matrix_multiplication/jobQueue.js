export{JobQueue};
import { matrix_mult_str } from "./algorithms.js";
import{ arr , matrix_B } from "./matrixSplit.js";

class Job{//the job nodes of the job queue
    constructor(jobId, alg, matrixB, next = null, previous = null){
        this.jobId = jobId;
        this.subtaskList = new Queue_linked_list_subtask;
        this.matrixB = matrixB;
        this.next = next;
        this.previous = previous;
        this.alg=alg;
    }
}

class subTask{//the subtask nodes og the subtask queue in the job queue
    constructor(jobId, taskId, next = null, previous = null){
        this.jobId = jobId;
        this.taskId = taskId;
        this.matrixA ;
        this.next = next;
        this.previous = previous;
    }
}


/**
 * A queue using a linked list 
 * @method enQueue - will put the new element at the head of the queue
 * @method deQueue - will remove the tail element of the queue
 * @method removeJob - will search for the job with the specific job id and remove it from the queue
 */
class Queue_linked_list_job {
    constructor(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    enQueue(jobId, matrixB) {
        if (this.head === null) {
            this.tail = this.head = new Job(jobId, matrix_mult_str, matrixB, this.head, this.tail);
            this.size++;
        }
        else{
            this.head.previous = this.head = new Job(jobId, matrix_mult_str, matrixB, this.head);
            this.size++;
        }
    }

    deQueue(){
        if (this.head === null){return;}
        if (this.head === this.tail){
            this.head = this.tail = null;
        }
        else {
            this.tail.previous.next = null;
            this.tail = this.tail.previous;
        }
        this.size--;
    }

    removeJob(JobId){
        let x = this.head;
        while(JobId !== x.job_id){
            x = x.next;
        }
        x.previous.next = x.next;
        x.next = x.previous;
        this.size--;
    }
}

/**
 * A queue using a linked list 
 * @method enQueue - will put the new element at the head of the queue
 * @method deQueue - will remove the tail element of the queue
 */
class Queue_linked_list_subtask{
    constructor(head, tail){
        this.head = null;
        this.tail = null
        this.size = 0;
    }

    enQueue(jobId, taskId) {
        if (this.head === null) {
            this.tail = this.head = new subTask(jobId, taskId, this.head, this.tail);
            this.size++;
        }
        else{
            this.head.previous = this.head = new subTask(jobId, taskId, this.head);
            this.size++;
        }
    }

    deQueue(){
        if (this.head === null){return;}
        if (this.head === this.tail){
            this.head = this.tail = null;
        }
        else {
            this.tail.previous.next = null;
            this.tail = this.tail.previous;
        }
        this.size--;
    }
}

//Making a demo job queue
let JobQueue = new Queue_linked_list_job;

JobQueue.enQueue(1, matrix_B);
for (let index = 0; index < arr.length; index++) {
    JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index);
    JobQueue.head.subtaskList.head.matrixA = arr[index];
}

JobQueue.enQueue(2, matrix_B);
for (let index = 0; index < arr.length; index++) {
    JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index);
    JobQueue.head.subtaskList.head.matrixA = arr[index];
}


