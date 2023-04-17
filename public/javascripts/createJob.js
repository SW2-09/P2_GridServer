const mainDiv = document.getElementById("mainDiv");


const content = {
CreateJob: `<div>
<h1>Job creation</h1>
</div>
<div id="creationForm">
<form   action="/buyer/upload"
        method="post"
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
    <input type="submit" value="Create Job">
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