export { randomMatrix, makeMatrixPair };

import { spy, assert as assertSinon } from "sinon";
import { addMatrixToQue } from "../../Jobtypes/matrix_multiplication/jobCreateMatrixMult.js";
import { subtaskFeeder, jobDone } from "../../Jobtypes/taskFeed.js";
import { JobQueue } from "../../Jobtypes/jobQueue.js";

/*
describe("taskFeed.js", function () {
    describe("subtaskFeeder", function () {
        it("should call jobDone once when one job in queue", function (done) {
            let matrixPair = makeMatrixPair(1000, 1000, 1000, 100);

            addMatrixToQue(
                "a",
                "matrixMult",
                "Donald Duck",
                matrixPair[0],
                matrixPair[1],
                JobQueue
            );

            let iterations = JobQueue.tail.subtaskList.size;

            let spy_jobDone = spy(jobDone);

            for (let i = 0; i < iterations; i++) {
                subtaskFeeder();
            }
            done();
            assertSinon.calledOnce(spy_jobDone);
        });

        it("should call jobDone twice when one job in queue", function (done) {
            let matrixPair = makeMatrixPair(1000, 1000, 1000, 100);

            addMatrixToQue(
                "a",
                "matrixMult",
                "Donald Duck",
                matrixPair[0],
                matrixPair[1],
                JobQueue
            );

            addMatrixToQue(
                "b",
                "matrixMult",
                "Donald Duck",
                matrixPair[0],
                matrixPair[1],
                JobQueue
            );

            console.log(JobQueue.size);

            let iterations =
                JobQueue.tail.subtaskList.size + JobQueue.head.subtaskList.size;

            let spy_jobDone = spy(jobDone);

            for (let i = 0; i < iterations; i++) {
                  subtaskFeeder();
            }
            done();
            assertSinon.calledTwice(spy_jobDone);
        });
    });
});
*/
function randomMatrix(columns, rows, range) {
    let matrix = [];

    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < columns; j++) {
            let sign = Math.round(Math.random()) * 2 - 1;
            matrix[i][j] =
                (sign * Math.round(range * Math.random() * 100)) / 100;
        }
    }

    return matrix;
}

function makeMatrixPair(n, m, l, range) {
    let matrix_A = {
        entries: randomMatrix(n, m, range),
        columns: m,
        rows: n,
    };

    let matrix_B = {
        entries: randomMatrix(m, l, range),
        columns: l,
        rows: m,
    };

    return [matrix_A, matrix_B];
}

