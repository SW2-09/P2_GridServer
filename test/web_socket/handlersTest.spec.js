import {spy} from "sinon";
import {assert as assertSinon} from "sinon"
import {subtaskFeeder} from "../../Jobtypes/matrix_multiplication/taskFeed.js"
import{JobQueue} from "../../Jobtypes/matrix_multiplication/jobQueue.js";
import { WebSocket } from "ws";
import { WebSocketServer } from "ws";
import {arr, matrix_B} from "../../Jobtypes/matrix_multiplication/matrixSplit.js"

let handlers={
  JobQueue: JobQueue,
  subtaskFeeder: subtaskFeeder,
  ws: null,
  sendSubtask: function sendSubtask(){
                  //console.log("subtasklist tail:"+JobQueue.tail.subtaskList.tail);
                  let next_task = handlers.subtaskFeeder(handlers.JobQueue,handlers.ws);
                  handlers.ws.send(JSON.stringify(next_task));
                },
  messageHandler: function messageHandler(message){

                    // Try is for if some one sends somehting which cannot be passed to JSON:
                    try {
                    let messageParse = JSON.parse(message);
                    console.log("Message recieved about this job:");
                    console.log(
                      messageParse.jobId
                      );
                    } catch (e) {
                    console.log(`Something went wrong with the recieved message: ${e.message}`);
                    }

                    try{
                      handlers.sendSubtask();
                    } catch (e){
                    console.log(`Something went wrong with sending message to server: ${e.message}`);
                    }
                  },
connectionHandler: function connectionHandler(ws){
                      handlers.ws=ws
                      console.log("New client connected");
                      console.log("JobQueue: " + JobQueue);
  
                      if (JobQueue.size > 0) {
                      
                      handlers.sendSubtask(ws);
                      } else {
                      ws.send("0");
                      }

                     ws.on("message", handlers.messageHandler)
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

        handlers.JobQueue.tail.subtaskList.tail=null;
        let spy_deQueue=spy(handlers.JobQueue,"deQueue");
        assertSinon.notCalled(spy_deQueue);
    });
    });
});