export { JobQueue, Job };
import fs from "fs";

import { createFolder } from "../utility.js";
import { addMatrixToQue } from "./matrix_multiplication/jobCreateMatrixMult.js";
import { addPlusToQue } from "./plus/jobCreatePlus.js";

/**
 * Constructor for a job object in the job-queue. Note that each job includes two linked list queues,
 * `subtaskList` and `pendingList` for subtasks.
 * @constructor
 * @param {string} jobId - The Id of the job.
 * @param {string} jobType - The type of the job.
 * @param {string} jobOwner - The owner of the job.
 * @param {string} algorithm - The algorithm used for the job formatted as string.
 * @param {array} commonData - The commondata associated with the job.
 * @param {Job|null} next - The reference to the next job in the queue.
 * @param {Job|null} previous - The reference to the previous job in the queue.
 */
class Job {
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
        this.Starttime = Date.now();
    }
}
/**
 * Constructor for a subTask object in a subtask-queue within a Job.
 * @constructor
 * @param {string} jobId - The id of the parent job.
 * @param {string} taskId - The id of the task.
 * @param {Array} data - The data to be processed.
 * @param {subTask|null} next - The next task in the queue.
 * @param {subTask|null} previous - The previous task in the queue.
 */
class subTask {
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
 * Represents a queue implemented using a doubly linked list.
 * It is tailored to handle the queue of subTask objects within a Job.
 */
class Queue_linked_list_job {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.MaxSize = 10;
        this.calcMax = Math.pow(1500, 3); // Max size of calculation
    }

    /**
     * Adds a new job to the head of the queue.
     * @param {string} jobId - The ID of the job.
     * @param {string} jobType - The Type of the job.
     * @param {string} jobOwner - The Owner of the Job.
     * @param {function} algorithm - The algorithm formatted as a string to be computed.
     * @param {array} commonData - The common data used in the job. Default is an empty array.
     */
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
    /**
     * Removes the tail job of the queue.
     * (The next job in the queue)
     */
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

    /**
     * Removes a job with a specific job id from the queue.
     *
     * @param {string} JobId
     * @returns
     */
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
 * Represents a queue using doubly linked list. Use this queue with subtask objects.
 */
class Queue_linked_list_subtask {
    constructor(head, tail) {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    /**
     * Adds a new subtask to the head of the queue.
     *
     * @param {string} jobId  - The ID of the job.
     * @param {string} taskId  - The ID of the task.
     * @param {object} data - The task's data to be computed.
     */
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
    /**
     * Removes the tail element of the queue.
     */
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
    /**
     * Removes a specific task from the queue.
     *
     * @param {string} TaskId - The ID of the task to be removed
     */
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
if (JobQueue.size < JobQueue.maxSize) {
    addJobsToQueServerstart(dirPending);
}

/**
 * Reads jobs from the pending jobs folder and adds these to a the queue.
 *
 * @param {string} dir - The directory of the pending jobs folder.
 */
function addJobsToQueServerstart(dir) {
    fs.readdirSync(dir).forEach((job) => {
        let jobParsed = JSON.parse(fs.readFileSync(dir + "/" + job));
        console.log("creating job: ");
        let jobtype = jobParsed.type;
        console.log(jobtype);
        if (JobQueue.size < JobQueue.MaxSize) {
            addJobToQue(jobtype, jobParsed);
        }
    });
}

/**
 * Adds a job to the queue based on it's type.
 * Currently supported is `matrixMult` and `plus`
 * @param {string} jobtype - The type of job. Either `matrixMult` or `plus`
 * @param {object} jobParsed - The parsed job object.
 * @throws {Error} Throws an error if the job is not found.
 */
export function addJobToQue(jobtype, jobParsed) {
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
                matrix_B,
                JobQueue
            );
            break;
        }
        case "plus": {
            // in case the jobtype is plus

            addPlusToQue(
                jobParsed.JobId,
                jobtype,
                jobParsed.jobOwner,
                jobParsed.arr,
                JobQueue
            );

            break;
        }
        default: {
            // in case the jobtype is not found
            throw new Error("Jobtype not found");
        }
    }
}
