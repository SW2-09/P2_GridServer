export { JobQueue };
import fs from "fs";

import { createFolder } from "../utility.js";
import { addMatrixToQue} from "./matrix_multiplication/jobCreateMatrixMult.js";
import { addPlusToQue } from "./plus/jobCreatePlus.js";

//import{ arr , matrix_A, matrix_B } from "./matrixSplit.js";

class Job {
    //the job nodes of the job queue
    constructor(
        jobId,
        jobType,
        jobOwner,
        algorithm,
        commonData,
        next = null,
        previous = null
    ) {
        this.jobId = jobId;
        this.jobType = jobType;
        this.jobOwner = jobOwner;
        this.subtaskList = new Queue_linked_list_subtask();
        this.pendingList = new Queue_linked_list_subtask();
        this.commonData = commonData;
        this.next = next;
        this.previous = previous;
        this.alg = algorithm;
        this.solutions = [];
        this.numOfSolutions = 0;
        this.numOfTasks = 0;
    }
}

class subTask {
    //the subtask nodes og the subtask queue in the job queue
    constructor(jobId, taskId, data, next = null, previous = null) {
        this.jobId = jobId;
        this.taskId = taskId;
        this.data = data;
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
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.MaxSize = 10;
        this.calcMax = Math.pow(1000, 3);
    }

    enQueue(jobId, jobType, jobOwner, algorithm, commonData = null) {
        //adds a new job to the queue
        if (commonData === null) {
            commonData = [];
        }
        if (this.head === null) {
            //if the queue is empty
            this.tail = this.head = new Job(
                jobId,
                jobType,
                jobOwner,
                algorithm,
                commonData,
                this.head,
                this.tail
            );
            this.size++;
        } else {
            this.head.previous = this.head = new Job(
                jobId,
                jobType,
                jobOwner,
                algorithm,
                commonData,
                this.head
            );
            this.size++;
        }
    }

    deQueue() {
        //removes the tail of the queue
        if (this.head === null) {
            return;
        } //if the queue is empty
        if (this.head === this.tail) {
            //if the queue has only one job
            this.head = this.tail = null;
        } else {
            this.tail.previous.next = null;
            this.tail = this.tail.previous;
        }
        this.size--;
    }

    removeJob(JobId) {
        if (this.head === null) {
            //if the queue is empty
            return;
        }
        let x = this.head;
        while (JobId !== x.jobId) {
            if (x.next === null) {
                return;
            }
            x = x.next;
        }
        if (x === this.head && x === this.tail) {
            //if the job is the only job in the queue
            this.head = this.tail = null;
        } else if (x === this.head) {
            //if the job is the head of the queue
            x.next.previous = null;
            this.head = this.head.next;
        } else if (x === this.tail) {
            //if the job is the tail of the queue
            x.previous.next = null;
            this.tail = this.tail.previous;
        } else {
            //if the job is in the middle of the queue
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
class Queue_linked_list_subtask {
    constructor(head, tail) {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    enQueue(jobId, taskId, data) {
        //will put the new element at the head of the queue
        if (this.head === null) {
            //if the queue is empty
            this.tail = this.head = new subTask(
                jobId,
                taskId,
                data,
                this.head,
                this.tail
            );
            this.size++;
        } else {
            this.head.previous = this.head = new subTask(
                jobId,
                taskId,
                data,
                this.head
            );
            this.size++;
        }
    }

    deQueue() {
        //removes the tail element of the queue
        if (this.head === null) {
            return;
        } //if the queue is empty
        if (this.head === this.tail) {
            //if the queue only has one element
            this.head = this.tail = null;
        } else {
            this.tail.previous.next = null;
            // const oldTail = this.tail;
            this.tail = this.tail.previous;
            // oldTail.previous = null;
        }
        this.size--;
    }

    removeTask(TaskId) {
        //removes the task with the specific task id
        if (this.head === null) {
            //if the queue is empty
            return;
        }
        let x = this.head;

        while (TaskId !== x.taskId) {
            if (x.next === null) {
                return;
            }
            x = x.next;
        }
        if (x === this.head && x === this.tail) {
            //if the job is the only job in the queue
            this.head = this.tail = null;
        } else if (x === this.head) {
            //if the job is the head of the queue
            x.next.previous = null;
            this.head = this.head.next;
        } else if (x === this.tail) {
            //if the job is the tail of the queue
            x.previous.next = null;
            this.tail = this.tail.previous;
        } else {
            //if the job is in the middle of the queue
            x.previous.next = x.next;
            x.next.previous = x.previous;
        }
        this.size--;
    }
}

//Making a demo job queue
let JobQueue = new Queue_linked_list_job();

let dirActive = "./jobData/ActiveJobs";
let dirPending = "./jobData/PendingJobs";

if (!fs.existsSync(dirActive)) {
    createFolder(dirActive);
}
if (!fs.existsSync(dirPending)) {
    createFolder(dirPending);
}

addJobsToQueServerstart(dirActive);
addJobsToQueServerstart(dirPending);

//adding all the jobs in the pending jobs folder to the queue
function addJobsToQueServerstart(dir) {    
        fs.readdirSync(dir).forEach((job) => {
        let jobParsed = JSON.parse(fs.readFileSync(dir + "/" + job));
        console.log("creating job: ");
        let jobtype = jobParsed.type;
        console.log(jobtype);
        addJobToQue(jobtype, jobParsed);

        
    });
}

export function addJobToQue(jobtype, jobParsed){
switch (jobtype) {
    case "matrixMult": {
        // in case the jobtype is matrix multiplication
        let matrix_A = {
            entries: jobParsed.arrA,
            columns: jobParsed.arrA[0].length,
            rows: jobParsed.arrA.length,
        };
        let matrix_B = {
            entries: jobParsed.arrB,
            columns: jobParsed.arrB[0].length,
            rows: jobParsed.arrB.length,
        };
        addMatrixToQue(
            jobParsed.jobId,
            jobtype,
            jobParsed.jobOwner,
            matrix_A,
            matrix_B
        );
        break;
    }
    case "plus": {
        // in case the jobtype is plus

        addPlusToQue(
            jobParsed.JobId,
            jobtype,
            jobParsed.jobOwner,
            jobParsed.arr
        );

        break;
    }
    default: {
        // in case the jobtype is not found
        throw new Error("Jobtype not found");
    }
}}