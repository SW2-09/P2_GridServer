import { combineMatrixResult } from "../../../Jobtypes/matrix_multiplication/combineMatrixMult.js";
import { makeMatrixPair } from "../../helper_functions.js";
import { assert } from "chai";

describe("combineMatrixMult.js", function () {
    describe("combineMatrixResult", function () {
        it("Should return the correct final matrix", function () {
            let workCountAndSolution = combineMatrixResult(job);

            let expectedSolution = [
                [1, 2],
                [3, 4],
                [5, 6],
                [7, 8],
                [9, 10],
                [11, 12],
            ];

            assert.deepEqual(workCountAndSolution.final, expectedSolution);
        });
        it("should count work correctly", function () {
            let workCountAndSolution = combineMatrixResult(job);

            let expectedWorkDone = [2, 1];
 
            assert.equal(
                expectedWorkDone[0],
                workCountAndSolution.workerArr[0].computed
            );
            assert.equal(
                expectedWorkDone[1],
                workCountAndSolution.workerArr[1].computed
            );
        });
    });
});

let solution1 = {
    taskId: 0,
    solution: [
        [1, 2],
        [3, 4],
    ],
};

let solution2 = {
    taskId: 1,
    solution: [
        [5, 6],
        [7, 8],
    ],
};

let solution3 = {
    taskId: 2,
    solution: [
        [9, 10],
        [11, 12],
    ],
};

let worker0 = {
    worderId: 0,
    workerSolutions: [solution1, solution2],
};

let worker1 = {
    worderId: 1,
    workerSolutions: [solution3],
};

let job = {
    solutions: [worker0, worker1],
};


