const mainDiv = document.getElementById("mainDiv");

const content = {
CreateJob: `<div>
<h1>Job creation</h1>
</div>

<div id="creationForm" class="uploadForm">
<form  
    enctype="multipart/form-data" id="uploadForm" >
    
    <div>
        <input class="form-control" type="text" name="jobTitle" id="jobTitle" placeholder="Job Title" required>
    </div>

    <div>
        <input class="form-control" type="text" name="jobDescription" id="jobDescription" placeholder="Job Description" required>
    </div>

    <div id="typeChoice" class="form-control">
        <select  id="jobType" name="jobType" class="form-dropdown">
            <option value="none">Job Type</option>
            <option id="ny" value="matrixMult">Matrix multiplication</option>
            <option value="plus">Plus</option>
            </select>
    </div>

    <div id="Uploadtype"></div>
</form>
<div class="buttons">
<input class="createjob-button" id="submit" type="submit" value="Create Job">
<button id="cancelJob" class="cancelJob">Cancel</button>
</div>
</div>
`,

JobList:`

`

/*

<script> 

</script>

</div>
*/
,
JobsOverview: `
<div id="overviewDiv">
  <div>
    <h1>Current jobs</h1>
    <div class="JobTable">
    Det skal ind her
    </div>
    <div>
    <button id="jobInfo-button">Update joblist</button>
    </div>
  </div>
</div>`,

FrontPage:`
<div id="frontPage">
  <div>
    <h1> Job manager </h1>
    <p>Submit a new grid computing job by pressing "Create new job". To get results of a job, press "Jobs overview".</p>
    <button id="createJob-button" class="frontPageButtons"> Create new job</button>
    <button id="jobInfo-button" class="frontPageButtons"> Jobs overview</button>
  </div>`,



underconstruction: `<div>
<h1>Under construction</h1>
</div>
<div>
<button id="cancelJob">Cancel </button>
</div>
`,

matrixUpload: `<div>
  <div class="form-control">
    <label for="uploadFile">Matrix A</label>
    <input type="file" id="uploadFile" name="uploadFile" accept=".csv" required>
  </div>
  <div class="form-control">
    <label for="uploadFile2">Matrix B</label>
    <input type="file" id="uploadFile2" name="uploadFile2" accept=".csv" required>
  </div>  
</div>`,

plusUpload: `<div>
<div class="form-control">
    <label for="uploadFile">Numbers to add</label>
    <input type="file" id="uploadFile" name="uploadFile" accept=".csv" required>
  </div>
</div>`
};



async function generateTable (DOMProperty) {

  let jobsObject= await getJobarrayFromDB("QWERT")

  //console.log(jobsObject.jobs);

  let jobTable=document.createElement('table');

  document.querySelector(".JobTable").append(jobTable);

  let tableHeader="<th>Titel</th> <th>JobID</th> <th>Description</th> <th> Status </th> <th> Download </th>";

  jobTable.insertRow(0).innerHTML=tableHeader;

  jobsObject.jobs.forEach((job, index) => {
    let row = jobTable.insertRow(index+1);
    row.insertCell(0).innerHTML=index+1;
    row.insertCell(1).innerHTML=job.Des;
    row.insertCell(2).innerHTML=job.type;
    row.insertCell(3).innerHTML="under construction";
    if (true) {
      row.insertCell(4).innerHTML=`<button id=download_btn_${index}> Download </button>`
    }
  });
}

// Create job button
mainDiv.addEventListener("click", (e) => {
    if (e.target.id === "createJob-button") {
        mainDiv.innerHTML = content.CreateJob;
    }
});
// Jobs overview button
mainDiv.addEventListener("click", (e) => {
  if (e.target.id === "jobInfo-button") {
      mainDiv.innerHTML = content.JobsOverview;   
      const jobHTML = document.querySelector(".JobTable");
      jobHTML.innerHTML = content.JobList;
      generateTable(jobHTML.body)
      
  }
});
// Cancel job button
mainDiv.addEventListener("click", (e) => {
    if (e.target.id === "cancelJob") {
      mainDiv.innerHTML = content.CurrentJobs;
        
    }
});

mainDiv.addEventListener("change", (e) => {
    if (e.target.id === "jobType") {
        if (e.target.value === "matrixMult") {
            document.getElementById('Uploadtype').innerHTML = content.matrixUpload;
        }
        else if (e.target.value === "plus") {
          document.getElementById('Uploadtype').innerHTML = content.plusUpload;
      }
        else {
            document.getElementById('Uploadtype').innerHTML = ''
        }
    }
});

mainDiv.innerHTML = content.FrontPage;

mainDiv.addEventListener("click", async (e) => {
    if (e.target.id === "submit") {
      const jobType = document.getElementById("jobType").value;
      const Uploadform = document.getElementById("uploadForm")
      const jobTitle = document.getElementById("jobTitle").value;
      const jobDescription = document.getElementById("jobDescription").value;

      if(!Uploadform.checkValidity() ||jobType==="none") {
          Uploadform.reportValidity();
          e.preventDefault();}
          
      else {
        let formData;
        switch (jobType) {
          case "matrixMult":{
            e.preventDefault();
            const fileInput1 = document.getElementById("uploadFile");
            const fileInput2 = document.getElementById("uploadFile2");
      
            const allowedFileFormat = ["text/csv", "application/json"]; //allows JSON and csv formats
            const maxFileSize = 10 * 1024 * 1024; // 10 MB
      
            if (!allowedFileFormat.includes(fileInput1.files[0].type) || !allowedFileFormat.includes(fileInput2.files[0].type)) {
                alert("Please choose a valid file format(csv or json)");
                return;
            }
      
            const file1 = await parseCsvToJson(fileInput1.files[0], jobType);
            const file2 = await parseCsvToJson(fileInput2.files[0], jobType);
        
            formData = {jobTitle : jobTitle, jobDescription : jobDescription, jobType : jobType, uploadFile : file1, uploadFile2 : file2}
            
            break;
          }
          case "plus":{
            e.preventDefault();
            const fileInput = document.getElementById("uploadFile");
      
            const allowedFileFormat = ["text/csv", "application/json"]; //allows JSON and csv formats
            const maxFileSize = 10 * 1024 * 1024; // 10 MB
      
            if (!allowedFileFormat.includes(fileInput.files[0].type)){
                alert("Please choose a valid file format(csv or json)");
                return;
            }
      
            const file = await parseCsvToJson(fileInput.files[0], jobType);
      
            formData = {jobTitle : jobTitle, jobDescription : jobDescription, jobType : jobType, uploadFile : file}
            
          break;
          }
          default:
            console.log("error jobtype not supported")
            break;
        }
        console.log(formData);
        const response = await fetch("/buyer/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(formData),
        });
        
        const result = await response.text();
        console.log("server response:" + result);

    }
  });

function parseCsvToJson(file, jobType) {
    return new Promise((resolve, reject) => {
      let data = [];
  
      Papa.parse(file, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function (results) {
          let placeholder = [];
          if (jobType === "matrixMult") {
              for (let i = 0; i < results.data.length; i++) {
                for (let j = 0; j < results.data[i].length; j++) {
                  if (results.data[i][j]) {
                    placeholder.push(parseFloat(results.data[i][j]));
                  }
                }

                data.push(placeholder);
                placeholder = [];
              }

              resolve(data);
            }
          else if (jobType === "plus"){
            for (let i = 0; i < results.data[0].length; i++) {
              data.push(parseFloat(results.data[0][i]));
            }
            }

            resolve(data);

            },

        error: function (err) {
          reject(err);
        
        },
      });
    });
  }

  /*
mainDiv.addEventListener("click", async (e) => {
  if (e.target.id === "joblistUpdate") {
  console.log("jobinfo wip")

  getJobarrayFromDB("QWERT")

  }
})
*/



async function getJobarrayFromDB(username){
  console.log(username)
  const response = await fetch("/buyer/jobinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //Send username to server

    body: JSON.stringify({username: username}),
  });
  
  let jobs = await response.json();
  return jobs
}

/*  document.getElementById("joblistUpdate").addEventListener("click",async (e) => {
        console.log("jobinfo wip")
        const repsonse=await fetch("/buyer/joblist")
  })
  */


document.getElementById("testbutton").addEventListener('click', () => {
    console.log("test")
    fetch("/buyer/test", {
        method: "POST",
})});
