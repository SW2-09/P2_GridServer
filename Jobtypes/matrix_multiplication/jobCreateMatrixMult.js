export { createMatrixMultJob, addMatrixToQue, divideMatrices };
export { matrix_mult_str };

let matrix_mult_str = `let AColumns = A[0].length;
    let Arows = A.length;
    let Bcolumns = B[0].length;
    let Brows = B.length;
    if (AColumns !== Brows){
        return false;
    }
    let matrix_AxB = new Array(Arows);
    for (let index = 0; index < Arows; index++) {
        matrix_AxB[index] = new Array(Bcolumns);
    }
  
    let count = 0;
  
    for (let ACurrentRows = 0; ACurrentRows < Arows; ACurrentRows++) {
        for (let BCurrentColumns = 0; BCurrentColumns < Bcolumns; BCurrentColumns++) {
            for (let index = 0; index < Brows; index++) {
                count += A[ACurrentRows][index]*B[index][BCurrentColumns];
            } 
            matrix_AxB[ACurrentRows][BCurrentColumns] = count;  
            count = 0;
        }
    }
    return matrix_AxB;
    `;

/**
 * Function to create a job of type matrix multiplication and enqueue it to the job queue.
 *
 * @param {object} jobData - Object holding the data used to create the job.
 * @param {string} jobOwner - The owner of the job.
 * @param {object} JobQueue - The job queue.
 *
 * @returns {object} The object holding the data used to create the job.
 */
function createMatrixMultJob(jobData, jobOwner, JobQueue) {
    const Jobdata = {
        jobId: jobData.jobId,
        jobOwner: jobOwner,
        Des: jobData.jobDescription,
        type: jobData.jobType,
        arrA: jobData.uploadFile,
        arrB: jobData.uploadFile2,
    };
    let matrix_A = {
        entries: Jobdata.arrA,
        columns: Jobdata.arrA[0].length,
        rows: Jobdata.arrA.length,
    };
    let matrix_B = {
        entries: Jobdata.arrB,
        columns: Jobdata.arrB[0].length,
        rows: Jobdata.arrB.length,
    };

    // adding the job to the job queue
    if (JobQueue.size < JobQueue.MaxSize) {
        addMatrixToQue(
            Jobdata.jobId,
            Jobdata.type,
            jobOwner,
            matrix_A,
            matrix_B,
            JobQueue
        );
    }
    console.log(JobQueue.size);
    console.log(JobQueue.head.numOfTasks);

    return Jobdata;
}

/**
 * Function for adding the matrix multiplication job to the job queue.
 *
 * @param {string} jobId - The ID of the job.
 * @param {string} jobType - The type of the job.
 * @param {string} jobOwner - The owner of the job.
 * @param {matrix} matrix_A - The matrix A.
 * @param {matrix} matrix_B - The matrix B.
 * @param {object} JobQueue - The job queue.
 */
function addMatrixToQue(
    jobId,
    jobType,
    jobOwner,
    matrix_A,
    matrix_B,
    JobQueue
) {
    let ARows = matrix_A.rows;
    let A = matrix_A.entries;

    let arr = divideMatrices(A, matrix_B, ARows, JobQueue.calcMax);

    // enqueue the job to the job queue
    JobQueue.enQueue(jobId, jobType, jobOwner, matrix_mult_str, matrix_B);
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
 * Recursive function to divide the matrix A into smaller matrices to fit desired calculation sizes for subtasks.
 *
 * @param {matrix} A - The matrix A.
 * @param {matrix} B - The matrix B.
 * @param {number} ARows - The number of rows in the matrix A.
 * @param {number} calcMax - The maximum calculation size.
 *
 * @returns {array} The array holding the sliced matrices of matrix A.
 */
function divideMatrices(A, B, ARows, calcMax) {
    let arr = []; // the array which will hold the sliced matrices of matrix A

    if (ARows * B.rows * B.columns < calcMax) {
        arr.push(A);
        return arr;
    }

    if (ARows < 2) {
        arr.push(A);
        return arr;
    }

    let slicedMatrixA = A.slice(0, Math.floor(A.length / 2));
    let slicedMatrixA2 = A.slice(Math.floor(A.length / 2), A.length);

    // Concatenate the returned arrays from the recursive calls
    arr = arr.concat(
        divideMatrices(slicedMatrixA, B, Math.floor(ARows / 2), calcMax),
        divideMatrices(slicedMatrixA2, B, Math.floor(ARows / 2), calcMax)
    );
    return arr;
}
