export { combineMatrixResult };

function combineMatrixResult (job){
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
        final: final
    }
    return workCountAndSolution;
}