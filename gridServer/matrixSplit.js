export{JobQueue, subtaskExtractor};
import { matrix_mult_str } from "./algorithms.js"; 
let matrix_mult= new Function('A','B',matrix_mult_str);


//the maxumimum amount of computations we want a single subtask to be
const calcMax = Math.pow(3,3);
const matrixsize = 1000;
//the two matrices that will be worked on
let matrix_B = {
    //creating a random matrix of size = matrixsize
    entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
    columns: matrixsize,
    rows: matrixsize,
}

let matrix_A = {
    entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
    columns: matrixsize,
    rows: matrixsize,
}

let arr = []; // the array which will hold the sliced matrixes of matrix A
let ARows = matrix_A.rows;
let A = matrix_A.entries;
//console.log(A);

/**
 * 
 * @param {Matrix} A the array containing the matrix A
 * @param {Matrix} B the array containing the matrix B
 * @param {number} ARows the number of rows in the matrix A
 * @returns does not return but pushes the slices of rows to an array
 */
function divideMatrices(A , B, ARows){
    if (ARows * B.rows * B.columns < calcMax){
        arr.push(A)
        return;
    }
    if (ARows < 2){
        arr.push(A)
        return;
    }
    let slicedMatrixA = A.slice(0,Math.floor(A.length/2));
    //console.log("her er slice 1 " + slicedMatrixA);
    let slicedMatrixA2 = A.slice(Math.floor(A.length/2),A.length);
    //console.log("her er slice 2 " + slicedMatrixA);
    divideMatrices(slicedMatrixA, B, Math.floor(ARows/2));
    divideMatrices(slicedMatrixA2, B, Math.floor(ARows/2));
}

divideMatrices(A, matrix_B, ARows)
//console.log(arr.length);
// console.log("hejsa " + arr[0]);

// let finished = [];
// for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr[i].length; j++) {
//         finished.push(arr[i][j])
//     }
// }

// console.log("finished = ");
// console.log(finished);


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

let JobQueue = new Queue_linked_list_job;
JobQueue.enQueue(1, matrix_B);
for (let index = 0; index < arr.length; index++) {
    JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index);
    JobQueue.head.subtaskList.head.matrixA = arr[index];
}

function subtaskExtractor(JobQueue){
    let nextJob=JobQueue.tail;
    while (JobQueue.tail.subtaskList.tail === null){
        nextJob = JobQueue.tail.previous
    }
    let workerPack={
        jobId: nextJob.jobId,
        alg: nextJob.alog,
        taskId: nextJob.subtaskList.tail.taskId,
        matrixB: nextJob.matrixB,
        matrixA: nextJob.subtaskList.tail.matrixA,
    }
    return workerPack
}

