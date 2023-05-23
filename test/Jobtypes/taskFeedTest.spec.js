export { randomMatrix, makeMatrixPair };

import { spy, assert as assertSinon } from "sinon";
import { addMatrixToQue } from "../../Jobtypes/matrix_multiplication/jobCreateMatrixMult.js";
import { subtaskFeeder, jobDone } from "../../Jobtypes/taskFeed.js";
import { JobQueue } from "../../Jobtypes/jobQueue.js";
import { assert} from "chai";


describe("taskFeed.js", function () {
    describe("subtaskFeeder", function () {
        
    });
});




describe("taskFeed.js", function () {
    describe("subtaskFeeder", function () {
        beforeEach(function () {
            while (!(JobQueue.tail == null)) {
                JobQueue.deQueue();
            }
        });
        it("should call jobDone once when one job in queue", function (done) {
            let matrixPair = makeMatrixPair(3000, 3000, 3000, 100);

            addMatrixToQue(
                "a",
                "matrixMult",
                "Donald Duck",
                matrixPair[0],
                matrixPair[1],
                JobQueue
            );

            let iterations = JobQueue.tail.subtaskList.size;

            let check;



            for (let i = 0; i < iterations+1; i++) {
                check = subtaskFeeder(1);
                if(i < iterations){
                    JobQueue.tail.numOfSolutions++;
                    JobQueue.tail.pendingList.deQueue();
                }
            }
            

            assert.equal(JobQueue.tail.subtaskList.tail, null, "subtasklist should be null");
            assert.equal(JobQueue.tail.pendingList.tail, null, "pendingList should be null");

            assert.equal(check, null, "check should be null");
            done();
            
        });

        it("should call jobDone twice when one job in queue", function (done) {
            let matrixPair = makeMatrixPair(3000, 3000, 3000, 100);

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

            let check;
            let iterations = JobQueue.tail.subtaskList.size;
            
                for (let i = 0; i < iterations+1; i++) {
                    check = subtaskFeeder(1);
                    if(i < iterations){
                        JobQueue.tail.numOfSolutions++;
                        JobQueue.tail.pendingList.deQueue();
                    }
                }
                
                JobQueue.deQueue();

                for (let i = 0; i < iterations+1; i++) {
                    check = subtaskFeeder(1);
                    if(i < iterations){
                        JobQueue.tail.numOfSolutions++;
                        JobQueue.tail.pendingList.deQueue();
                    }
                }
                
    
                assert.equal(JobQueue.tail.subtaskList.tail, null, "subtasklist should be null");
                assert.equal(JobQueue.tail.pendingList.tail, null, "pendingList should be null");
    
                assert.equal(check, null, "check should be null");
                done();
        });
    });
});


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