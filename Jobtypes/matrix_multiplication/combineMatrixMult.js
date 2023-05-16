export { combineMatrixResult };

/**
 * Combines the results from multiple workers into a single matrix.
 * @param {Object} job - The job object containing the solutions from workers.
 *
 * @returns {Object} - An object containing the combined matrix result and information about the workers.
 */
function combineMatrixResult(job) {
    let Solution = [];
    let workerArr = [];
    let final = [];

    job.solutions.forEach((element) => {
        //concatenates the solutions into one array to combine matrix
        workerArr.push({
            workerId: element.workerId,
            computed: element.workerSolutions.length,
        });

        element.workerSolutions.forEach((e) => {
            Solution[e.taskId] = e.solution;
        });
    });

    Solution.forEach((e) => {
        e.forEach((i) => {
            final.push(i);
        });
    });
    let workCountAndSolution = {
        workerArr: workerArr,
        final: final,
    };
    return workCountAndSolution;
}
