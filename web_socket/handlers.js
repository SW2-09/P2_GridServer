export { startWebsocketserver }
import{JobQueue} from "../Jobtypes/matrix_multiplication/jobQueue.js";
import{subtaskFeeder, queueEmpty} from "../Jobtypes/matrix_multiplication/taskFeed.js";
import { WebSocketServer } from "ws";
import { server} from "../server.js";

// websocket connection:
function startWebsocketserver(){
const wss = new WebSocketServer({ server });

console.log(`There are ${JobQueue.size} jobs in the queue.`);

/**
 * Sending subtask to the worker
 * @param ws - websocket connection with the worker (
 * @param JobQueue - Queue of all jobs submitted by buyers
 */
function send_subtask(ws, JobQueue) {
  let next_task = subtaskFeeder(JobQueue);
  if (next_task !== null) { //if there is a subtask to send
    ws.send(JSON.stringify(next_task));
  }
  else{ //if there is no subtask to send
    console.log("sending 0 to worker")
    ws.send("0");
  }
}

/**
 * Managing ws communications with worker. Two callbacks
 * on "connection" - frst subtask is sent to the worker
 * on "message" - the solution contained in the message is parsed from string to object, and the next subtask is send.
 */
wss.on("connection", (ws) => { //callback for when a new client connects
  console.log("New client connected");
  console.log("JobQueue: " + JobQueue);
  if (JobQueue.size > 0) { //if the queue is not empty, send a subtask to the worker
    send_subtask(ws, JobQueue);
  } else { //if the queue is empty, send 0 to the worker
    console.log("sending 0 to worker")
    ws.send("0");
  }

  ws.on("message", (message) => { //callback for when a message is recieved from the client
    // Try is for if some one sends somehting which cannot be passed to JSON:
    try {
      let messageParse = JSON.parse(message);
      console.log("Solution recieved:");

      console.log("jobID: " + messageParse["jobId"]);
      console.log("taskID: " + messageParse["taskId"]);
      let currentJob=findJob(messageParse["jobId"]); //find the job in the queue
      currentJob.solutions[messageParse["taskId"]] = messageParse["solution"]; 
      currentJob.numOfSolutions++; //increase the number of solutions
      currentJob.pendingList.removeTask(messageParse["taskId"]); //remove the task from the pending list
      // console.log("job solutions" + JobQueue.tail.solutions.length);
      // console.log(messageParse["solution"]);


    } catch (e) { //if the message cannot be parsed to JSON
      console.log(`Something went wrong with the recieved message: ${e.message}`);
    }

    try{ //try to send the next subtask
        send_subtask(ws, JobQueue);
    } catch (e){ //if an error occurs when sending a subtask
      console.log(`Something went wrong with sending message to server: ${e.message}`);
    }
  });

  ws.on("close", () => { //when the worker disconnects
    console.log("Client has disconnected");
  });

})};


/**
 * Function to find a job in the queue by its jobId
 * @param {number} jobId 
 * @returns the job with the given jobId
 */
function findJob(jobId){
  let currentJob=JobQueue.tail;
  if (currentJob.jobId==jobId){
    return currentJob;
  }
  while(currentJob.previous.jobId!=jobId){
    currentJob=currentJob.previous;
  }
  return currentJob.previous;
}
