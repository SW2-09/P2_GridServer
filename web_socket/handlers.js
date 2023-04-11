import{JobQueue} from "../Jobtypes/matrix_multiplication/jobQueue.js";
import{subtaskFeeder, queueEmpty} from "../Jobtypes/matrix_multiplication/taskFeed.js";
import { WebSocketServer } from "ws";

// websocket connection:
const wss = new WebSocketServer({ port: 8001 });

console.log(`There are ${JobQueue.size} jobs in the queue.`);

/**
 * Sending subtask to the worker
 * @param ws - websocket connection with the worker (
 * @param JobQueue - Queue of all jobs submitted by buyers
 */
function send_subtask(ws, JobQueue) {
  let next_task = subtaskFeeder(JobQueue);
  ws.send(JSON.stringify(next_task));
}

/**
 * Managing ws communications with worker. Two callbacks
 * on "connection" - frst subtask is sent to the worker
 * on "message" - the solution contained in the message is parsed from string to object, and the next subtask is send.
 */
wss.on("connection", (ws) => {
  console.log("New client connected");
  console.log("JobQueue: " + JobQueue);
  if (JobQueue.size > 0) {
    send_subtask(ws, JobQueue);
  } else {
    ws.send("0");
  }

  ws.on("message", (message) => {
    // Try is for if some one sends somehting which cannot be passed to JSON:
    try {
      let messageParse = JSON.parse(message);
      console.log("Solution recieved:");
      console.log(messageParse["solution"]);

    } catch (e) {
      console.log(`Something went wrong with the recieved message: ${e.message}`);
    }

    try{
        send_subtask(ws, JobQueue);
    } catch (e){
      console.log(`Something went wrong with sending message to server: ${e.message}`);
    }

  });

  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});