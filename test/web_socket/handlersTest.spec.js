import { spy, assert as assertSinon } from "sinon";
import { WebSocket, WebSocketServer } from "ws";
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
        it('should send "connected"', (done) => {
            let spy_send = spy(client, "send");
            handlers.connectionHandler(client);
            assertSinon.calledWith(spy_send, "connected");
            done();
        });
    });

    describe("sendSubtask", () => {
        it("should call subtaskFeeder", (done) => {
            let spy_subtaskFeeder = spy(handlers, "subtaskFeeder");
            handlers.sendSubtask(client);
            assertSinon.calledOnce(spy_subtaskFeeder);
            done();
        });
    });
});
