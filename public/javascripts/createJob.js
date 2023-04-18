const mainDiv = document.getElementById("mainDiv");


const content = {
CreateJob: `<div>
<h1>Job creation</h1>
</div>
<div id="creationForm">
<form  
    enctype="multipart/form-data">
    <div>
        <label for="jobTitle">Job Title</label>
        <input type="text" name="jobTitle" id="jobTitle">
    </div>
    <div>
        <label for="jobDescription">Job Description</label>
        <input type="text" name="jobDescription" id="jobDescription">
    </div>
    <div id="typeChoice">
        <label for="jobType">Job Type</label>
        <select id="jobType" name="jobType">
            <option value="none">None</option>
            <option id="ny" value="matrixMult">Matrix multiplication</option>
            <option value="none">Et sejt projekt</option>
            <option value="none">Et andet sejt projekt</option>
            </select>
    </div>
    <div id="Uploadtype"></div>
    <input id="submit" type="submit" value="Create Job">
</form>
<div>
<button id="cancelJob">Cancel</button>
</div>
`,

CurrentJobs: `
<div id="mainDiv">
  <div>
    <h2>Current jobs</h2>
    <div class="JobList">
      <p>HEJSA</p>
    </div>
  </div>
    <button id="createJob-button" class="Create-Job"> Create new job</button>
</div>`,

underconstruction: `<div>
<h1>Under construction</h1>
</div>
<div>
<button id="cancelJob">Cancel</button>
</div>
`,

matrixUpload: `<div>
<label for="uploadFile">Matrix A</label>
<input type="file" id="uploadFile" name="uploadFile" accept=".csv">

<label for="uploadFile2">Matrix B</label>
<input type="file" id="uploadFile2" name="uploadFile2" accept=".csv">
</div>`,
};



mainDiv.addEventListener("click", (e) => {
    if (e.target.id === "createJob-button") {
        mainDiv.innerHTML = content.CreateJob;
    }
});

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
        else {
            document.getElementById('Uploadtype').innerHTML = ''
        }
    }
});

mainDiv.innerHTML = content.CurrentJobs;



mainDiv.addEventListener("click", async (e) => {
    if (e.target.id === "submit") {
        e.preventDefault();
        console.log("submit")
        const jobTitle = document.getElementById("jobTitle").value;
        const jobDescription = document.getElementById("jobDescription").value;
        const jobType = document.getElementById("jobType").value;
        const fileInput1 = document.getElementById("uploadFile");
        const fileInput2 = document.getElementById("uploadFile2");

        const file1 = await parseCsvToJson(fileInput1.files[0]);
        const file2 = await parseCsvToJson(fileInput2.files[0]);
        console.log(file1);
    
        const formData = {jobTitle : jobTitle, jobDescription : jobDescription, jobType : jobType, uploadFile : file1, uploadFile2 : file2}
        
        console.log(formData);
        fetch("/buyer/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(formData),
        });
        
    }
});

function parseCsvToJson(file) {
    return new Promise((resolve, reject) => {
      let matrix = [];
  
      Papa.parse(file, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function (results) {
          let placeholder = [];
  
          for (let i = 0; i < results.data.length; i++) {
            for (let j = 0; j < results.data[i].length; j++) {
              if (results.data[i][j]) {
                placeholder.push(parseFloat(results.data[i][j]));
              }
            }
  
            matrix.push(placeholder);
            placeholder = [];
          }
          console.log(matrix);
  
          resolve(matrix);
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  }
