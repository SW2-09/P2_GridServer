//Creation of 2 demo subtasks:
let matrixsize = 1000;

let matrixB = {
  entries: Array(matrixsize)
    .fill(0)
    .map(() =>
      Array(matrixsize)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10))
    ),
  columns: matrixsize,
  rows: matrixsize,
};

let matrixA = {
  entries: Array(matrixsize)
    .fill(0)
    .map(() =>
      Array(matrixsize)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10))
    ),
  columns: matrixsize,
  rows: matrixsize,
};

function createSubtask(id, matrixA, matrixB) {
  this.id = id;
  this.matrixA = matrixA;
  this.matrixB = matrixB;
}

let slicedMatrixA = matrixA.entries.slice(
  0,
  Math.floor(matrixA.entries.length / 2)
);
let slicedMatrixA2 = matrixA.entries.slice(
  Math.floor(matrixA.entries.length / 2),
  matrixA.entries.length
);

let subtask1 = new createSubtask(1, slicedMatrixA, matrixB.entries);
let subtask2 = new createSubtask(1, slicedMatrixA2, matrixB.entries);

// Task object with 6 substasks (odd numbered subtasks are same and even numberes subtasks are same)
let task = {
  subtask1: subtask1,
  subtask2: subtask2,
  subtask3: subtask1,
  subtask4: subtask1,
  subtask5: subtask2,
  subtask6: subtask1,
};

//Creation of subtask queues:
function Queue() {
  this.elements = {};
  this.tail = 0;
  this.head = 0;
  this.enqueue = function (element) {
    this.elements[this.tail] = element;
    this.tail++;
  };
  this.dequeue = function () {
    let element = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return element;
  };
}

let PendingQ = new Queue();

// enqueuing subtasks
for (let subtask in task) {
  PendingQ.enqueue(task[subtask]);
}

console.log(PendingQ);

//Sending subtask to a connected worker
function send_subtask(ws, subtaskQuPend) {
  let next_task = subtaskQuPend.dequeue();
  ws.send(JSON.stringify(next_task));
}

/////////////////////////////////////////////////////////////////////////////////
// Websocket server
////////////////////////////////////////////////////////////////////////////////

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8001 });

wss.on("connection", (ws) => {
  console.log("New client connected");

  if (Object.keys(PendingQ.elements).length > 0) {
    send_subtask(ws, PendingQ);
  } else {
    ws.send("No tasks in queue");
  }

  ws.on("message", (message) => {
    // Try is for if some one sends somehting which cannot be passed to JSON:
    try {
      messageParse = JSON.parse(message);
      console.log(messageParse);

      if (Object.keys(PendingQ.elements).length > 0) {
        send_subtask(ws, PendingQ);
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
