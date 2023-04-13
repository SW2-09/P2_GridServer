
let matrixUpload = `<div>
<form
    ref="uploadForm"
    id="uploadForm"
    action="/buyer/upload"
    method="post"
    enctype="multipart/form-data"
>
<label for="uploadFile">Matrix A</label>
<input type="file" id="uploadFile" name="uploadFile" accept=".csv">

<label for="uploadFile2">Matrix B</label>
<input type="file" id="uploadFile2" name="uploadFile2" accept=".csv">

<input id="uploadButton" type="submit" value="Upload!" />
</form>
</div>`



let secondPage = `
<h1>Job creation</h1>
</div>
<div id="creationForm">
<form>
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
    <div>
    <input type="submit" value="Create Job">
</form>
<div>
<button id="cancelJob">Cancel</button>
</div>
<script src="test.js"></script>`;

let frontPage = `body>
<div id="mainDiv">
  <div>
    <h1 id="h1">Welcome <%= name%></h1>
    <button id="logout" class="logout"> Logout</button>
  </div>
  <div>
    <h2>Current jobs</h2>
    <div class="JobList">
      <p>HEJSA</p>
    </div>
  </div>
    <button id="createJob-button" class="Create-Job"> Create new job</button>
</div>
</body>`


document.getElementById("createJob-button").addEventListener("mouseover", ()=> {
    console.log("det virker");
});

document.getElementById("cancelJob").addEventListener("click", ()=> {
    console.log("hejsa");
    const mainDiv = document.querySelector("#mainDiv");
    mainDiv.innerHTML = frontPage;
});

document.getElementById("jobType").addEventListener("mouseover", ()=> {
    const jobType = document.getElementById("jobType").value; 
    console.log(jobType);
});

document.getElementById("createJob-button").addEventListener("click", ()=> {
    const mainDiv = document.querySelector("#mainDiv");
    mainDiv.innerHTML = secondPage;
    
});



 
