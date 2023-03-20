
const calcMax = Math.pow(3,3);

const matrixsize = 10;

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



let arr = [];
let ARows = matrix_A.rows;
let A = matrix_A.entries;
console.log(A);

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
console.log(arr.length);
// console.log("hejsa " + arr[0]);

// let finished = [];
// for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr[i].length; j++) {
//         finished.push(arr[i][j])
//     }
// }

// console.log("finished = ");
// console.log(finished);


class Job{
    constructor(job_id, data, next = null, previous = null){
        this.job_id = job_id;
        this.data = data;
        this.next = next;
        this.previous = previous;
    }
}

class Queue_linked_list{
    constructor(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    enQueue(job_id, data) {
        if (this.head === null) {
            this.tail = this.head = new Job(job_id, data, this.head, this.tail);
            this.size++;
        }
        else{
            this.head.previous = this.head = new Job(job_id, data, this.head);
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

let SubTaskQueue = new Queue_linked_list;
for (let index = 0; index < arr.length; index++) {
    SubTaskQueue.enQueue(index, arr[index])
}

console.log("lenght = " + arr.length);
console.log("queue = " + SubTaskQueue.size);
console.log("data = " );
console.log(SubTaskQueue.head.data);

while (SubTaskQueue.head !== null){
    console.log("en hale");
    console.log(SubTaskQueue.tail.data);
    SubTaskQueue.deQueue();
}