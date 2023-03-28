// algorithm
function matrix_mult(A,B){
  let AColumns = A[0].length;
  let Arows = A.length;
  let Bcolumns = B[0].length;
  let Brows = B.length;
  if (AColumns !== Brows){
      console.log("Matrix multiplication not possible with given matrices");
      return false;
  }
  let matrix_AxB = new Array(Arows);
  for (let index = 0; index < Arows; index++) {
      matrix_AxB[index] = new Array(Bcolumns);
  }

  let count = 0;

  for (let ACurrentRows = 0; ACurrentRows < Arows; ACurrentRows++) {
      for (let BCurrentColumns = 0; BCurrentColumns < Bcolumns; BCurrentColumns++) {
          for (let index = 0; index < Brows; index++) {
              count += A[ACurrentRows][index]*B[index][BCurrentColumns];
          } 
          matrix_AxB[ACurrentRows][BCurrentColumns] = count;  
          count = 0;
      }
  }
  return matrix_AxB;
  }

// open ws connection and handler for "message" events
function openWsConnection(){
  const ws= new WebSocket("ws://localhost:8001");

  let workerID=Math.floor(Math.random() * 1000);

  ws.addEventListener("message", e=>{
      if(e.data=="No tasks in queue"){
          console.log("No tasks in queue");
          ws.close();
      } else{
          console.log("Client recieved:"+e.data);
          let nextSubtask=JSON.parse(e.data);
          console.log(nextSubtask);
          console.log(nextSubtask.matrixA);
          console.log(nextSubtask.matrixB);

          let start_comp=Date.now();
          let solution=matrix_mult(nextSubtask.matrixA,nextSubtask.matrixB.entries);
          let end_comp=Date.now();

          console.log(`Computation took ${(end_comp-start_comp)/1000} s`);
          
          let subSolution={
              workerID: workerID,
              solution: solution
          }

          ws.send(JSON.stringify(subSolution));

          console.log(`A subsolution was send by worker: ${subSolution.workerID}`);
      }
  });
return ws;
}

//Ensure only 1 checkbox can be checked
const checkboxes = document.querySelectorAll('input[name="option"]');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    checkboxes.forEach((c) => {
      if (c !== event.target) {
        c.checked = false;
      }
    });
  });
});


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
