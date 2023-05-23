export { createPlusJob, addPlusToQue };
export { plus_str };
/*
let result = [];
 result.push(A+B)*/

let plus_str = `let result = [];
for (let i = 0; i < 1000000; i++) {
    for (let j = 0; j < 1000; j++) {

        let x = Math.random() * 100;
    }
}

result.push(A+B);
return result;`;

/**
 * function to create a job of type plus and enqueue it to the job queue.
 *
 * @param {Object} jobData - Object holding the data for the job.
 * @param {Object} jobOwner - Owner of the job.
 * @param {Object} JobQueue - The JobQueue.
 *
 * @returns {Object} The object holding the data used to create the job.
 */
function createPlusJob(jobInput, jobOwner, JobQueue) {
    const Jobdata = {
        jobId: jobInput.jobId,
        jobOwner: jobOwner,
        Des: jobInput.jobDescription,
        type: jobInput.jobType,
        arr: jobInput.uploadFile,
    };

    // adding the job to the job queue
    if (JobQueue.size < JobQueue.MaxSize) {
        addPlusToQue(
            Jobdata.jobId,
            Jobdata.type,
            jobOwner,
            Jobdata.arr,
            JobQueue
        );
    }
    console.log(JobQueue.size);
    console.log(JobQueue.head.numOfTasks);
    return Jobdata;
}

/**
 * Function which will enqueue the plus job to the job queue.
 *
 * @param {string} jobId - The id of the job.
 * @param {string} jobType - The type of the job.
 * @param {string} jobOwner - The owner of the job.
 * @param {array} entries - The array which holds the numbers to be added.
 * @param {object} jobQueue - The job queue.
 */
function addPlusToQue(jobId, jobType, jobOwner, entries, jobQueue) {
    let entriesCopy = [];
    for (let i = 0; i < entries.length; i++) {
        entriesCopy[i] = entries[i];
    }

    let arrPlusPieces = dividePlus(entriesCopy);
    // enqueue the job to the job queue
    jobQueue.enQueue(jobId, jobType, jobOwner, plus_str);

    for (let index = 0; index < arrPlusPieces.length; index++) {
        jobQueue.head.subtaskList.enQueue(
            jobQueue.head.jobId,
            index,
            arrPlusPieces[index]
        );
        jobQueue.head.numOfTasks++;
    }
}

/**
 * Function to divide the array of entries into smaller arrays to fit desired calculation sizes for subtasks.
 *
 * @param {array} entries - The entries for the addition job.
 * @returns {array} New array of smaller subtasks.
 */
function dividePlus(entries) {
    let arr = []; // the array which will hold the smaller problems
    let index = 0;
    for (index; 1 < entries.length; index++) {
        arr[index] = [];
        arr[index][0] = entries.pop();
        arr[index][1] = entries.pop();
    }
    if (entries.length == 1) {
        arr[index] = [];
        arr[index][0] = entries.pop();
        arr[index][1] = 0;
    }
    return arr;
}
