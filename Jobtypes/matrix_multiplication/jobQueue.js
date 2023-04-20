export{JobQueue};
import { matrix_mult_str } from "./algorithms.js";
import{ arr , matrix_A, matrix_B } from "./matrixSplit.js";

class Job{//the job nodes of the job queue
    constructor(jobId, alg, matrixB, next = null, previous = null){
        this.jobId = jobId;
        this.subtaskList = new Queue_linked_list_subtask;
        this.pendingList = new Queue_linked_list_subtask;
        this.matrixB = matrixB;
        this.next = next;
        this.previous = previous;
        this.alg = alg;
        this.solutions = [];
        this.numOfSolutions = 0;
        this.numOfTasks = 0;
    }
}

class subTask{//the subtask nodes og the subtask queue in the job queue
    constructor(jobId, taskId, matrixA, next = null, previous = null){
        this.jobId = jobId;
        this.taskId = taskId;
        this.matrixA ;
        this.next = next;
        this.previous = previous;
        this.sendTime = 0;
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

    enQueue(jobId, matrixB) { //adds a new job to the queue
        if (this.head === null) { //if the queue is empty
            this.tail = this.head = new Job(jobId, matrix_mult_str, matrixB, this.head, this.tail);
            this.size++;
        }
        else{
            this.head.previous = this.head = new Job(jobId, matrix_mult_str, matrixB, this.head);
            this.size++;
        }
    }

    deQueue(){ //removes the tail of the queue
        if (this.head === null){return;} //if the queue is empty
        if (this.head === this.tail){ //if the queue has only one job
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
        while(JobId !== x.jobId){
            x = x.next;
        }
        if (x === this.head && x === this.tail){ //if the job is the only job in the queue
            this.head = this.tail = null;
        }
        else if (x === this.head){ //if the job is the head of the queue
            this.head = this.head.next;
        }
        else if (x === this.tail){ //if the job is the tail of the queue
            this.tail = this.tail.previous;
        }
        else { //if the job is in the middle of the queue
            x.previous.next = x.next;
            x.next.previous = x.previous;
        }
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

    enQueue(jobId, taskId) { //will put the new element at the head of the queue
        if (this.head === null) { //if the queue is empty
            this.tail = this.head = new subTask(jobId, taskId, matrix_A, this.head, this.tail);
            this.size++;
        }
        else{
            this.head.previous = this.head = new subTask(jobId, taskId, matrix_A, this.head);
            this.size++;
        }
    }

    deQueue(){ //removes the tail element of the queue
        if (this.head === null){return;} //if the queue is empty
        if (this.head === this.tail){ //if the queue only has one element
            this.head = this.tail = null;
        }
        else {
            this.tail.previous.next = null;
            this.tail = this.tail.previous;
        }
        this.size--;
    }

    removeTask(TaskId){ //removes the task with the specific task id
        let x = this.head;
        while(TaskId !== x.taskId){
            x = x.next;
        }
        if (x === this.head && x === this.tail){ //if the job is the only job in the queue
            this.head = this.tail = null;
        }
        else if (x === this.head){ //if the job is the head of the queue
            this.head = this.head.next;
        }
        else if (x === this.tail){ //if the job is the tail of the queue
            this.tail = this.tail.previous;
        }
        else { //if the job is in the middle of the queue
            x.previous.next = x.next;
            x.next.previous = x.previous;
        }
        this.size--;
    }
}


//Making a demo job queue
let JobQueue = new Queue_linked_list_job;

// JobQueue.enQueue(1, matrix_B);
// for (let index = 0; index < arr.length; index++) {
//     JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
//     JobQueue.head.numOfTasks++;
// }

// JobQueue.enQueue(2, matrix_B);
// for (let index = 0; index < arr.length; index++) {
//     JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
//     JobQueue.head.numOfTasks++;
// }



