import { spy, assert as assertSinon } from "sinon";
import { WebSocket, WebSocketServer } from "ws";
import { subtaskFeeder} from "../../Jobtypes/taskFeed.js";
import { JobQueue } from "../../Jobtypes/jobQueue.js";


describe("handlers", function () {
    let server, client;

    describe("connectionHandler", function () {
        beforeEach(function (done) {
            server = new WebSocketServer({ port: 8002 });
            server.on("listening", function () {
                client = new WebSocket("ws://localhost:8002");
                client.on("open", function () {
                    done();
                });
            });
        });

        afterEach(function (done) {
            server.close(function () {
                client.close();
            });
            done();
        });

        it("should call console.log() once on server connect (with empty JobQueue)", function (done) {
            let spyLog = spy(console, "log");
            JobQueue.size = 0;
            handlers.connectionHandler(client);
            assertSinon.calledOnce(spyLog);
            done();
        });

        it('should send "connected"', function (done) {
            let spy_send = spy(client, "send");
            JobQueue.size = 0;
            handlers.connectionHandler(client);
            done();
            assertSinon.calledOnce(spy_send, "connected");
        });
    });

    describe("messageHandler", function () {
        beforeEach(function (done) {
            server = new WebSocketServer({ port: 8002 });
            server.on("listening", function () {
                client = new WebSocket("ws://localhost:8002");
                client.on("open", function () {
                    done();
                });
            });
        });

        afterEach(function (done) {
            server.close(function () {
                client.close();
            });
            done();
        });

        it('should send "standby" if JobQueue.size==0', function (done) {
            let spy_send = spy(client, "send");
            JobQueue.size = 0;
            handlers.connectionHandler(client);
            done();
            assertSinon.calledOnce(spy_send, "connected");
        });

        it("should call sendSubask if JobQueue.size>0", function (done) {
            let spy_send = spy(handlers, "sendSubtask");
            JobQueue.size = 1;
            handlers.connectionHandler(client);
            done();
            assertSinon.calledOnce(spy_send);
        });
    });

    describe("sendSubtask", function () {
        beforeEach(function (done) {
            server = new WebSocketServer({ port: 8002 });
            server.on("listening", function () {
                client = new WebSocket("ws://localhost:8002");
                client.on("open", function () {
                    done();
                });
            });
        });

        afterEach(function (done) {
            server.close(function () {
                client.close();
            });
            done();
        });

        it("should call subtaskFeeder", function (done) {
            let spy_subtaskFeeder = spy(handlers, "subtaskFeeder");
            handlers.sendSubtask(client);
            done();
            assertSinon.calledOnce(spy_subtaskFeeder);
        });
    });


});


// Udestående: handlers skal importeres frem for defineres i denne fil. Det virker dog ikke umiddelbart.
//import {handlers} from "../../web_socket/handlers.js"

let handlers = {
    subtaskFeeder: subtaskFeeder,
    sendSubtask: function send_subtask(ws, workerId) {
        let next_task = handlers.subtaskFeeder();
        if (next_task !== null) {
            //if there is a subtask to send
            ws.send(JSON.stringify(next_task));
        } else {
            //if there is no subtask to send
            console.log("sending standby to: " + workerId);
            ws.send("standby");
        }
    },
    messageHandler: function (ws) {
        //callback for when a message is recieved from the client
        // Try is for if some one sends somehting which cannot be passed to JSON:
        return (message) => {
            try {
                let messageParse = JSON.parse(message);
                if (messageParse["data"] === "connected") {
                    console.log(
                        "worker connected: " + messageParse["workerId"]
                    );
                    let workerdata = {
                        workerId: messageParse["workerId"],
                        workerSocket: ws,
                    };
                    serverdata.connectedworkers.push(workerdata);
                    handlers.sendSubtask(ws, messageParse["workerId"]);
                } else if (messageParse["data"] === "ready for work") {
                    console.log("her");
                    //if the worker is ready for work
                    //send_subtask(ws, JobQueue); //send a subtask to the worker
                    handlers.sendSubtask(ws, messageParse["workerId"]);
                } else {
                    let messageParse = JSON.parse(message);

                    let currentJob = findJob(messageParse["jobId"]);
                    if (currentJob === null) {
                        console.log("Job not found or already done.");
                        handlers.sendSubtask(ws, messageParse["workerId"]);
                        return;
                    }
                    let currentTask = findTask(
                        currentJob,
                        messageParse["taskId"]
                    );
                    if (currentTask === null) {
                        console.log("task not found or already done.");
                        handlers.sendSubtask(ws, messageParse["workerId"]);
                        return;
                    }

                    console.log("----------------------------------------");
                    console.log("Solution recieved:");
                    serverdata.jobsComputed++;
                    console.log("jobID: " + messageParse["jobId"]);
                    console.log("taskID: " + messageParse["taskId"]);
                    console.log("----------------------------------------");

                    //find the job in the queue
                    let currentSolution = messageParse["solution"];
                    let workerFound = false;
                    for (
                        let index = 0;
                        index < currentJob.solutions.length;
                        index++
                    ) {
                        if (
                            currentJob.solutions[index].workerId ===
                            messageParse["workerId"]
                        ) {
                            workerFound = true;
                            currentJob.solutions[index].workerSolutions.push({
                                taskId: messageParse["taskId"],
                                solution: createTaskSolution(currentSolution),
                            });
                            currentJob.numOfSolutions++;
                            break;
                        }
                    }
                    if (workerFound === false) {
                        currentJob.solutions.push({
                            workerId: messageParse["workerId"],
                            workerSolutions: [
                                {
                                    taskId: messageParse["taskId"],
                                    solution:
                                        createTaskSolution(currentSolution),
                                },
                            ],
                        });
                        currentJob.numOfSolutions++;
                    }
                    currentJob.pendingList.removeTask(messageParse["taskId"]); //remove the task from the pending list

                    handlers.sendSubtask(ws, messageParse["workerId"]);
                }
            } finally {
            }
            // catch (e) {
            //     //if the message cannot be parsed to JSON
            //     console.log(
            //         `Something went wrong with the recieved message: ${e.message}`
            //     );
            // }
        };
    },
    connectionHandler: function (ws) {
        //callback for when a new client connects

        console.log("New client connected");

        ws.send("connected");

        ws.on("message", handlers.messageHandler(ws));

        ws.on("close", () => {
            //remove the worker from the connected workers list
            serverdata.connectedworkers.splice(
                serverdata.connectedworkers.indexOf(ws),
                1
            );
            //when the worker disconnects
            console.log("Client has disconnected");
        });
    },
};
