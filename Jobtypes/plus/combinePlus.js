export { combinePlusResult}

function combinePlusResult(job) {
    let Solution = [];
    let workerArr = [];
    let final = 0;
    job.solutions.forEach((element) => {
        workerArr.push({
            workerId: element.workerId,
            computed: element.workerSolutions.length,
        });
        for (
            let index = 0;
            index < element.workerSolutions.length;
            index++
        ) {
            Solution[element.workerSolutions[index].taskId] =
                element.workerSolutions[index].solution[0];
        }
    });
    

    final = 0;
    Solution.forEach((e) => {
        final += e;
    });
    let workCountAndSolution = {
        workerArr: workerArr,
        final: final
    }
    return workCountAndSolution;
}