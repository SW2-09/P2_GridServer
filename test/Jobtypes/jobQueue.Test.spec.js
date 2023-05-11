import { assert } from "chai";
import { JobQueue } from "../../Jobtypes/jobQueue.js";
import { makeMatrixPair } from "./taskFeedTest.spec.js";

describe("jobQueue.js", function () {
    beforeEach(function () {
        while (!(JobQueue.tail == null)) {
            JobQueue.deQueue();
        }
    });
    it("Should have size 0 when queue is empty", function () {
        let expectedSize = 0;
        assert.equal(JobQueue.size, expectedSize);
    });

    describe("enQueue and deQueue", function () {
        it("Should have size 1 after one job is enqueued in an empty queue", function () {

                JobQueue.enQueue(`testJobId`, "testJobType", "Donald Duck");

            let expectedSize = 1;

            assert.equal(JobQueue.size, expectedSize);
        });
        it("Should have size 1 after 10 jobs are added to an empty queue and 9 are removed", function () {
            for (let i = 1; i < 11; i++) {
                JobQueue.enQueue(`testJobId${i}`, "testJobType", "Donald Duck");
            }

            for (let i = 1; i < 10; i++) {
                JobQueue.deQueue();
            }

            let expectedSize = 1;

            assert.equal(JobQueue.size, expectedSize);
        });
        it("Should have size 0 after a job is added to an empty queue and then dequeued", function () {
            let matrixPair = makeMatrixPair(2, 2, 2, 10);

            JobQueue.enQueue(`testJobId`, "testJobType", "Donald Duck");
            JobQueue.deQueue();
            let expectedSize = 0;

            assert.equal(JobQueue.size, expectedSize);
        });
        it("Head and tail should have jobId of enqueued if enqueued in empty queue", function () {
            JobQueue.enQueue("testJobId", "testJobType", "Donald Duck");

            let expectedJobId = "testJobId";

            assert.equal(JobQueue.head.jobId, expectedJobId);
            assert.equal(JobQueue.tail.jobId, expectedJobId);
        });
        it("Head and tail should have correct jobIds when 10 jobs are enqueued in empty queue", function () {
            for (let i = 1; i < 11; i++) {
                JobQueue.enQueue(`testJobId${i}`, "testJobType", "Donald Duck");
            }

            let expectedJobId1 = "testJobId1";
            let expectedJobId10 = "testJobId10";

            assert.equal(JobQueue.tail.jobId, expectedJobId1);
            assert.equal(JobQueue.head.jobId, expectedJobId10);
        });
    });

    describe("removeJob", function () {
        it("Should have size 9 when job number 5 of 10 jobs are removed", function () {
            for (let i = 1; i < 11; i++) {
                JobQueue.enQueue(`testJobId${i}`, "testJobType", "Donald Duck");
            }

            JobQueue.removeJob("testJobId5");

            let expectedSize = 9;

            assert.equal(JobQueue.size, expectedSize);
        });

        it("Should leave queue empty when the only job in queue is removed", function () {
            JobQueue.enQueue(`testJobId`, "testJobType", "Donald Duck");
            JobQueue.removeJob(`testJobId`);

            let expectedSize = 0;
            let expectedHead = null;
            let expectedTail = null;

            assert.equal(JobQueue.size, expectedSize);
            assert.equal(JobQueue.head, expectedHead);
            assert.equal(JobQueue.head, expectedTail);
        });
        it("Should update head correctly if head is removed", function () {
            JobQueue.enQueue(`testJobId1`, "testJobType", "Donald Duck");
            JobQueue.enQueue(`testJobId2`, "testJobType", "Donald Duck");
            JobQueue.enQueue(`testJobId3`, "testJobType", "Donald Duck");
            JobQueue.removeJob(`testJobId3`);

            let expectedHeadJobId = `testJobId2`;

            assert.equal(JobQueue.head.jobId, expectedHeadJobId);
        });
        it("Should update tail correctly if tail is removed", function () {
            JobQueue.enQueue(`testJobId1`, "testJobType", "Donald Duck");
            JobQueue.enQueue(`testJobId2`, "testJobType", "Donald Duck");
            JobQueue.enQueue(`testJobId3`, "testJobType", "Donald Duck");
            JobQueue.removeJob(`testJobId1`);

            let expectedTailJobId = `testJobId2`;

            assert.equal(JobQueue.tail.jobId, expectedTailJobId);
        });

        it("Should update job2.next and job4.previous correctly if job3 is removed", function () {
            for (let i = 1; i < 6; i++) {
                JobQueue.enQueue(`testJobId${i}`, "testJobType", "Donald Duck");
            }

            let expectedPreviousNext = `testJobId4`;
            let expectedNextPrevious = `testJobId2`;

            let job2 = JobQueue.tail.previous;
            let job4 = JobQueue.head.next;

            JobQueue.removeJob(`testJobId3`);

            assert.equal(job2.previous.jobId, expectedPreviousNext);
            assert.equal(job4.next.jobId, expectedNextPrevious);
        });
    });
});
