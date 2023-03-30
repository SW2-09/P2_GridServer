// open ws connection and handler for "message" events
function openWsConnection(){
  const ws= new WebSocket("ws://localhost:8001");

  let workerID=Math.floor(Math.random() * 1000);

  ws.addEventListener("message", e=>{
          console.log("Client recieved:"+e.data);
          let nextSubtask=JSON.parse(e.data);
          console.log("Next subtask:");
          console.log(nextSubtask);
          console.log("Matrix A:");
          console.log(nextSubtask.matrixA);
          console.log("Matrix B:");
          console.log(nextSubtask.matrixB);

          let alg=new Function('A','B',nextSubtask.alg);

          let start_comp=Date.now();
          let solution=alg(nextSubtask.matrixA,nextSubtask.matrixB.entries);
          let end_comp=Date.now();

          console.log(`Computation took ${(end_comp-start_comp)/1000} s`);
          
          let subSolution={
              workerID: workerID,
              solution: solution
          }

          ws.send(JSON.stringify(subSolution));

          console.log(`A subsolution was send by worker: ${subSolution.workerID}`);
      }
  );
return ws;
}

function handleChange(event) {
  const option = event.target.value;
  const checkboxes = document.getElementsByName("option");

  if (option === "yes" && event.target.checked) {

    openWsConnection();

    checkboxes[1].checked = false;
  } else if (option === "no" && event.target.checked) {
    console.log("Worker is not computing");

    checkboxes[0].checked = false;
  } else{

  }
}
