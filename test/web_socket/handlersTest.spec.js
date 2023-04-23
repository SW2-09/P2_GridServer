
import {spy} from "sinon";
import {assert as assertSinon} from "sinon"

import { subtaskFeeder } from "../../Jobtypes/matrix_multiplication/taskFeed.js";
import{JobQueue} from "../../Jobtypes/matrix_multiplication/jobQueue.js";
import {arr, matrix_B} from "../../Jobtypes/matrix_multiplication/matrixSplit.js"

import { WebSocket } from "ws";
import { WebSocketServer } from "ws";
// Udestående: handlers skal importeres frem for defineres i denne fil. Det virker dog ikke umiddelbart. 
//import {handlers} from "../../web_socket/handlers.js"

let handlers={
    subtaskFeeder: subtaskFeeder,
    ws: null,
    sendSubtask: function send_subtask() {
      let next_task = handlers.subtaskFeeder(JobQueue);
      if (next_task !== null) { //if there is a subtask to send
        handlers.ws.send(JSON.stringify(next_task));
      }
      else{ //if there is no subtask to send
        console.log("sending 0 to worker")
        handlers.ws.send("0");
      }
    },
    messageHandler: (message) => { //callback for when a message is recieved from the client
      // Try is for if some one sends somehting which cannot be passed to JSON:
      try {
        let messageParse = JSON.parse(message);
        
        if (messageParse["data"] === "ready for work") { //if the worker is ready for work
        //send_subtask(ws, JobQueue); //send a subtask to the worker
        
        }
        else {
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
        }
        
      } catch (e) { //if the message cannot be parsed to JSON
        console.log(`Something went wrong with the recieved message: ${e.message}`);
      }
  
      try{ //try to send the next subtask
          handlers.sendSubtask();
      } catch (e){ //if an error occurs when sending a subtask
        console.log(`Something went wrong with sending message to server: ${e.message}`);
      }
    },
  connectionHandler: function connectionHandler(ws){//callback for when a new client connects
    handlers.ws=ws
    console.log("New client connected");
    if (JobQueue.size > 0) { //if the queue is not empty, send a subtask to the worker
    handlers.sendSubtask();
    } else { //if the queue is empty, send 0 to the worker
      console.log("sending 0 to worker")
      ws.send("0");
    }
  
    ws.on("message", handlers.messageHandler)
  
    ws.on("close", () => { //when the worker disconnects
      console.log("Client has disconnected");
    });
  }
  }



describe("handlers", function(){
  
    let server,client;

    describe("connectionHandler", function(){

      beforeEach(function(done){
        server= new WebSocketServer({ port: 8002 });
        server.on('listening', function(){
          client=new WebSocket('ws://localhost:8002')
          client.on('open', function(){
            done(); 
          });
        })
      });

      afterEach(function(done){
            server.close(function(){
              client.close();
            });
            done();
          });
      
    it("should call console.log() twice on server connect (with empty JobQueue)", function(done){
      let spyLog=spy(console,"log");
      JobQueue.size=0;
      handlers.connectionHandler(client);
      assertSinon.calledTwice(spyLog);
      done();
    });

    it("should send \"0\" if JobQueue.size==0", function(done){
      let spy_send=spy(client,"send");
      JobQueue.size=0;
      handlers.connectionHandler(client);
      assertSinon.calledWithExactly(spy_send,"0");
      done();
    });

    it("should call sendSubask if JobQueue.size>0", function(done){
      let spy_send=spy(handlers,"sendSubtask");
      JobQueue.size=1;
      handlers.connectionHandler(client);
      assertSinon.calledOnce(spy_send);
      done();
    });
  });

  
  describe("sendSubtask",function(){

    beforeEach(function(done){
      server= new WebSocketServer({ port: 8002 });
      server.on('listening', function(){
        client=new WebSocket('ws://localhost:8002')
        client.on('open', function(){
          done(); 
        });
      })
    });

    afterEach(function(done){
      server.close(function(){
        client.close();
      });
      done();
        });


    it("should call subtaskFeeder", function(done){
      handlers.ws=client;
      let spy_subtaskFeeder=spy(handlers,"subtaskFeeder");
      handlers.sendSubtask();
      done()
      assertSinon.calledOnce(spy_subtaskFeeder);
    })
  })

  describe("subtaskFeeder",function(){
    beforeEach(function(done){
      server= new WebSocketServer({ port: 8002 });
      server.on('listening', function(){
        client=new WebSocket('ws://localhost:8002')
        client.on('open', function(){
          done(); 
        });
      });
    });
    this.afterEach(function(done){
      done();
    })
    it("should call JobQueue.deQueue() if tail-job is empty of subtasks", function(){
         JobQueue.enQueue(1, matrix_B);
         for (let index = 0; index < arr.length; index++) {
         JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
         JobQueue.head.numOfTasks++;
         }

        JobQueue.tail.subtaskList.tail=null;
        let spy_deQueue=spy(JobQueue,"deQueue");
        assertSinon.notCalled(spy_deQueue);
    });
    });
});

