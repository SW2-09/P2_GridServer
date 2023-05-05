export {createPlusJob, addPlusToQue};
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
 * function to create a job of type plus and enqueue it to the job queue
 * @param {object} jobData object holding the data for the job
 * @returns the object used to create the job
 */
function createPlusJob(jobData, jobOwner, JobQueue) {
    const Jobdata = {
        jobId: jobData.jobId,
        jobOwner: jobOwner,
        Des: jobData.jobDescription,
        type: jobData.jobType,
        arr: jobData.uploadFile,
    };

    // adding the job to the job queue
    if(JobQueue.size < JobQueue.MaxSize){
    addPlusToQue(Jobdata.jobId, Jobdata.type, jobOwner, Jobdata.arr, JobQueue);
    }
    console.log(JobQueue.size);
    console.log(JobQueue.head.numOfTasks);
    return Jobdata;
}

/**
 * function which will enqueue the plus job to the job queue
 * @param {string} jobId the id of the job
 * @param {string} jobType the type of the job
 * @param {array} entries the array which holds the numbers to be added
 */
function addPlusToQue(jobId, jobType, jobOwner, entries, JobQueue) {
    let entriesCopy = [];
    for (let i = 0; i < entries.length; i++) {
        entriesCopy[i] = entries[i];
    }

    let arr = dividePlus(entriesCopy);
    // enqueue the job to the job queue
    JobQueue.enQueue(jobId, jobType, jobOwner, plus_str);

    for (let index = 0; index < arr.length; index++) {
        JobQueue.head.subtaskList.enQueue(
            JobQueue.head.jobId,
            index,
            arr[index]
        );
        JobQueue.head.numOfTasks++;
    }
}


/**
 * function to divide the array of entries into smaller arrays to fit desired calculation sizes for subtasks
 * @param {array} entries the array holding the entries to be added toghether
 * @returns new array of smaller subtasks
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