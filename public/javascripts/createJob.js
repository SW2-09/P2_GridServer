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
<button id="goBack-btn" class="cancelJob">Cancel</button>
</div>
</div>
`,

    JobsOverview: `
<div id="overviewDiv">
  <div>
    <h1>Your jobs</h1>
    <div class="JobTable">

    </div>
    <div>
    <button id="jobInfo-button" class="JobsOverviewButtons">Update joblist</button>
    <button id="goBack-btn" class="JobsOverviewButtons">Go back</button>
    </div>
  </div>
</div>`,

    FrontPage: `
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
</div>`,
};

mainDiv.innerHTML = content.FrontPage;

// ************** //
// Eventlisteners //
// ************** //

// Delete Job
mainDiv.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete_btn")) {
        try {
            const response = await fetch("/buyer/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: e.target.id }),
            }).then(generateTable());

            if (!response.ok) {
                throw new Error(`HTTP post error! ${response.status}`);
            }
        } catch (err) {
            console.error("Error: " + err);
        }
    }
});
// Download Job
mainDiv.addEventListener("click", async (e) => {
    if (e.target.classList.contains("download_btn")) {
        const response = await fetch("/buyer/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: e.target.id }),
        });
        let blob = await response.blob();
        //creates tempoary URL
        let fileURL = window.URL.createObjectURL(blob);

        document.getElementById(
            e.target.id
        ).innerHTML = `<a href=${fileURL} download=${e.target.id}> Download</a>`;
    }
});

// Create job button
mainDiv.addEventListener("click", (e) => {
    if (e.target.id === "createJob-button") {
        mainDiv.innerHTML = content.CreateJob;
    }
});

// Jobs overview button
mainDiv.addEventListener("click", (e) => {
    if (e.target.id === "jobInfo-button") {
        generateTable();
    }
});

// Back to homepage
mainDiv.addEventListener("click", (e) => {
    if (e.target.id === "goBack-btn") {
        mainDiv.innerHTML = content.FrontPage;
    }
});

mainDiv.addEventListener("change", (e) => {
    if (e.target.id === "jobType") {
        if (e.target.value === "matrixMult") {
            document.getElementById("Uploadtype").innerHTML =
                content.matrixUpload;
        } else if (e.target.value === "plus") {
            document.getElementById("Uploadtype").innerHTML =
                content.plusUpload;
        } else {
            document.getElementById("Uploadtype").innerHTML = "";
        }
    }
});

// ******************** //
// Upload functionality //
// ******************** //

mainDiv.addEventListener("click", async (e) => {
    if (e.target.id === "submit") {
        const jobType = document.getElementById("jobType").value;
        const Uploadform = document.getElementById("uploadForm");
        const jobTitle = document.getElementById("jobTitle").value;
        const jobDescription = document.getElementById("jobDescription").value;

        try {
            if (!Uploadform.checkValidity() || jobType === "none") {
                Uploadform.reportValidity();
                e.preventDefault();
            } else {
                let formData;
                switch (jobType) {
                    case "matrixMult": {
                        e.preventDefault();
                        const fileInput1 =
                            document.getElementById("uploadFile");
                        const fileInput2 =
                            document.getElementById("uploadFile2");

                        const allowedFileFormat = [
                            "text/csv",
                            "application/json",
                        ]; //allows JSON and csv formats
                        const maxFileSize = 10 * 1024 * 1024; // 10 MB

                        if (
                            !allowedFileFormat.includes(
                                fileInput1.files[0].type
                            ) ||
                            !allowedFileFormat.includes(
                                fileInput2.files[0].type
                            )
                        ) {
                            alert(
                                "Please choose a valid file format(csv or json)"
                            );
                            return;
                        }

                        const file1 = await parseCsvToJson(
                            fileInput1.files[0],
                            jobType
                        );
                        const file2 = await parseCsvToJson(
                            fileInput2.files[0],
                            jobType
                        );

                        if (!validateMatrix(file1, file2)) {
                            throw new Error("Error in validation");
                        }

                        formData = {
                            jobTitle: jobTitle,
                            jobDescription: jobDescription,
                            jobType: jobType,
                            uploadFile: file1,
                            uploadFile2: file2,
                        };

                        break;
                    }
                    case "plus": {
                        e.preventDefault();
                        const fileInput = document.getElementById("uploadFile");

                        const allowedFileFormat = [
                            "text/csv",
                            "application/json",
                        ]; //allows JSON and csv formats
                        const maxFileSize = 10 * 1024 * 1024; // 10 MB

                        if (
                            !allowedFileFormat.includes(fileInput.files[0].type)
                        ) {
                            alert(
                                "Please choose a valid file format(csv or json)"
                            );
                            return;
                        }

                        const file = await parseCsvToJson(
                            fileInput.files[0],
                            jobType
                        );

                        console.log(file);
                        if (!validateList(file)) {
                            throw new Error("Error in validation");
                        }

                        formData = {
                            jobTitle: jobTitle,
                            jobDescription: jobDescription,
                            jobType: jobType,
                            uploadFile: file,
                        };

                        break;
                    }
                    default:
                        console.log("error jobtype not supported");
                        break;
                }

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
        } catch (err) {
            console.log(err);
        }
    }
});

document.getElementById("testbutton").addEventListener("click", () => {
    console.log("test");
    fetch("/buyer/test", {
        method: "POST",
    });
});

// ***************** //
// Helper functions: //
// ***************** //

/**
 *
 * @param {file.csv} file .csv file to be passed as json
 * @param {string} jobType
 * @returns The file in json
 */
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
                                placeholder.push(
                                    parseFloat(results.data[i][j])
                                );
                            }
                        }

                        data.push(placeholder);
                        placeholder = [];
                    }

                    resolve(data);
                } else if (jobType === "plus") {
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

/**
 *@returns an object containing an array with information about the buyer's jobs and the buyers username
 * */
async function getJobarrayFromDB() {
    const response = await fetch("/buyer/jobinfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return await response.json();
}
// Generate JobList table for the buyer

async function generateTable() {
    mainDiv.innerHTML = content.JobsOverview;
    let infoObject = await getJobarrayFromDB();

    let jobTable = document.createElement("table");

    document.querySelector(".JobTable").append(jobTable);

    let tableHeader =
        "<th>Index</th> <th>Title</th> <th>Description</th> <th> Type</th> <th> Download solution </th>";

    jobTable.insertRow(0).innerHTML = tableHeader;

    infoObject.jobs.forEach((job, index) => {
        let row = jobTable.insertRow(index + 1);
        row.insertCell(0).innerHTML = index + 1;
        row.insertCell(1).innerHTML = job.jobID;
        row.insertCell(2).innerHTML = job.Des;
        row.insertCell(3).innerHTML = job.type;
        if (job.completed) {
            row.insertCell(
                4
            ).innerHTML = `<button class=download_btn id=${job.jobID}> 
             Prepare download</button>`;
        } else {
            row.insertCell(4).innerHTML = "<p>Not completed</p>";
        }
        row.insertCell(
            5
        ).innerHTML = `<button class=delete_btn id=${job.jobID}> Delete job </button>`;
    });
}

/**
 *
 * @param {array} matrixA
 * @param {array} matrixB
 * @returns Boolean if succesfuly
 */
function validateMatrix(matrixA, matrixB) {
    try {
        //Check dimensions of matricies
        if (matrixA[0].length !== matrixB.length) {
            throw new Error("Matrix dimensions do not match.");
        }
        // Check MatrixA
        for (let rowA = 0; rowA < matrixA.length; rowA++) {
            for (let colA = 0; colA < matrixA[rowA].length; colA++) {
                if (isNaN(matrixA[rowA][colA])) {
                    throw new Error("Matrix A is corrupted.");
                }
            }
        }
        // Check MatrixB
        for (let rowB = 0; rowB < matrixB.length; rowB++) {
            for (let colB = 0; colB < matrixB[rowB].length; colB++) {
                if (isNaN(matrixB[rowB][colB])) {
                    throw new Error("Matrix B is corrupted.");
                }
            }
        }
    } catch (err) {
        alert(err + " Please choose valid matricies.");
        return false;
    }
    return true;
}

function validateList(list) {
    try {
        for (let i = 0; i < list.length; i++) {
            if (isNaN(list[i])) {
                throw new Error("File is corrupt.");
            }
        }
    } catch (err) {
        alert(err + "Please try again");
        return false;
    }
    return true;
}
