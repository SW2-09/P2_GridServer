import{JobQueue, subtaskExtractor} from "./matrixSplit.js";
//const JobQueue = require("./matrixSplit");
//const Queue_linked_list_job = require("./matrixSplit")

console.log(JobQueue.size);
//let JobQueue = require('./matrixSplit.js');
//let subtaskExtractor = require('./matrixSplit.js');


//Sending subtask to a connected worker
function send_subtask(ws, JobQueue) {
  let next_task = subtaskExtractor(JobQueue);
  ws.send(JSON.stringify(next_task));
  JobQueue.head.subtaskList.deQueue();
}

/////////////////////////////////////////////////////////////////////////////////
// Websocket server
////////////////////////////////////////////////////////////////////////////////

import { WebSocketServer } from 'ws';

//const { WebSocketServer } = require ('ws')

const wss = new WebSocketServer({ port: 8001 });

wss.on("connection", (ws) => {
  console.log("New client connected");
  console.log("JobQueue: " + JobQueue)
  if (Object.keys(JobQueue.head).length > 0) {
    send_subtask(ws, JobQueue);
  } else {
    ws.send("No tasks in queue");
  }

  ws.on("message", (message) => {
    // Try is for if some one sends somehting which cannot be passed to JSON:
    try {
      let messageParse = JSON.parse(message);
      console.log(messageParse);

      if (Object.keys(JobQueue.head).length > 0) {
        send_subtask(ws, JobQueue);
      } else {
        ws.send("No tasks in queue");
      }
    } catch (e) {
      console.log(`Something went wrong with the message: ${e.message}`);
    }
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
  });
});