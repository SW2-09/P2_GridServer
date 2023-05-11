import { spy, assert as assertSinon } from "sinon";
import { WebSocket, WebSocketServer } from "ws";
import { JobQueue } from "../../Jobtypes/jobQueue.js";
import { handlers } from "../../web_socket/handlers.js";

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
