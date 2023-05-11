import { spy, assert as assertSinon } from "sinon";
import { WebSocket, WebSocketServer } from "ws";
import { JobQueue } from "../../Jobtypes/jobQueue.js";
import { handlers } from "../../web_socket/handlers.js";

describe("handlers.js", () => {
    let server, client;

    beforeEach((done) => {
        server = new WebSocketServer({ port: 8002 });
        server.on("listening", () => {
            client = new WebSocket("ws://localhost:8002");
            client.on("open", () => {
                done();
            });
        });
    });

    afterEach((done) => {
        server.close(() => {
            client.close();
        });
        done();
    });

    describe("connectionHandler", () => {
        it("should call console.log() once on server connect (with empty JobQueue)", (done) => {
            let spyLog = spy(console, "log");
            JobQueue.size = 0;
            handlers.connectionHandler(client);
            assertSinon.calledOnce(spyLog);
            done();
        });

        it('should send "connected"', (done) => {
            let spy_send = spy(client, "send");
            JobQueue.size = 0;
            handlers.connectionHandler(client);
            assertSinon.calledWith(spy_send, "connected");
            done();
        });
    });
    /*
    describe("messageHandler", function () {
        it("should call sendSubask if JobQueue.size>0", function (done) {
            let spy_send = spy(handlers, "sendSubtask");
            JobQueue.size = 1;
            handlers.messageHandler(client);
            assertSinon.calledOnce(spy_send);
            done();
        });
    });
    */

    describe("sendSubtask", () => {
        it("should call subtaskFeeder", (done) => {
            let spy_subtaskFeeder = spy(handlers, "subtaskFeeder");
            handlers.sendSubtask(client);
            done();
            assertSinon.calledOnce(spy_subtaskFeeder);
        });
    });
});
