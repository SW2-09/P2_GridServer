import { spy, assert as assertSinon } from "sinon";
import { assert } from "chai";
import { addMatrixToQue } from "../../Jobtypes/matrix_multiplication/jobCreateMatrixMult.js";
import { subtaskFeeder, jobDone } from "../../Jobtypes/taskFeed.js";
import { JobQueue } from "../../Jobtypes/jobQueue.js";
import { makeMatrixPair } from "./taskFeedTest.spec.js";

describe("jobQueue.js", function () {
    beforeEach(function () {
        while (!(JobQueue.tail == null)) {
            JobQueue.deQueue();
        }
    });
    it("should have size 0 when queue is empty", function () {
        let expectedSize = 0;
        assert.equal(JobQueue.size, expectedSize);
    });
    it("should have size 1 after a job is added to an empty queue", function () {
        let matrixPair = makeMatrixPair(2, 2, 2, 10);

        addMatrixToQue(
            "a",
            "matrixMult",
            "Donald Duck",
            matrixPair[0],
            matrixPair[1],
            JobQueue
        );
        let expectedSize = 1;

        assert.equal(JobQueue.size, expectedSize);
    });

    it("should have size 0 after a job is added to an empty queue and then removed", function () {
        let matrixPair = makeMatrixPair(2, 2, 2, 10);

        addMatrixToQue(
            "a",
            "matrixMult",
            "Donald Duck",
            matrixPair[0],
            matrixPair[1],
            JobQueue
        );
        console.log(JobQueue.size);
        JobQueue.deQueue();
        let expectedSize = 0;

        assert.equal(JobQueue.size, expectedSize);
    });
});
