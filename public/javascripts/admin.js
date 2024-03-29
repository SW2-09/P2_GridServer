const purge = document.getElementById("purge");
const resetwork = document.getElementById("resetWork");
const lookup = document.getElementById("Lookup");
const sessiondata = document.getElementById("sessiondata");
const mainDiv = document.getElementById("mainDiv");

let chartinterval;

const content = {
    lookupTable: ` <div class="WorkerTable" id="WorkerTable"> </div>`,
    computationChart: ` <canvas class="taskchart" id="taskchart"></canvas>
                    <canvas class="workerchart" id="workerchart"></canvas>`,
};

onload = async () => {
    loadSessionChart();
};

purge.addEventListener("click", async () => {
    clearInterval(chartinterval);
    let collectionvalue = document.getElementById("collection").value;
    if (collectionvalue === "status") {
        alert("Please select a collection in database");
        return;
    }
    if (
        confirm(
            "Are you sure you want to purge the collection: " + collectionvalue
        ) === false
    )
        return;
    try {
        console.log("Purging collection...");
        const response = await fetch("/admin/purge", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collection: collectionvalue,
            }),
        });

        if (response.status === 200) {
            const responseJson = await response.json();
            // console.log(responseJson.message);
        } else {
            console.log("Error");
        }
    } catch (err) {
        console.log(err);
    }
});

resetwork.addEventListener("click", async () => {
    clearInterval(chartinterval);
    if (
        confirm(
            "Are you sure you want to reset all worker computations?"
        ) === false
    )
        return;
    try {
        console.log("Resetting worker computations...");
        const response = await fetch("/admin/resetwork", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let responseJson = await response.json();
        console.log(responseJson.message);
    } catch (err) {
        console.log(err);
    }
});


collection.addEventListener("change", async () => {
    clearInterval(chartinterval);
    let collectionvalue = document.getElementById("collection").value;
    try {
        if (collectionvalue === "status") {
            loadSessionChart();
        }
        dblookup(collectionvalue);
    } catch (err) {
        console.log("Error");
    }
});

mainDiv.addEventListener("click", async (e) => {
    let collectionvalue = document.getElementById("collection").value;
    if (e.target.className === "delete") {
        console.log("Delete user: " + e.target.value);
        await fetch("/admin/deleteone", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: e.target.value,
                collection: collectionvalue,
            }),
        });
        dblookup(collectionvalue);
    }
    if (e.target.className === "clearJobs") {
        console.log("Clear jobs");
        await fetch("/admin/clearjobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                collection: collectionvalue,
                name: e.target.value,
            }),
        });
        dblookup(collectionvalue);
    }

});
/**
 * Looks up a collection in the MongoDB database and generates a table for either `users`, `workers` or `buyers`.
 *
 * @param {string} collectionvalue - The name of the collection to be looked up.
 */
async function dblookup(collectionvalue) {
    let responseJson;
    console.log("Looking up collection...");
    const response = await fetch("/admin/lookup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            collection: collectionvalue,
        }),
    });
    if (response.status === 200) {
        responseJson = await response.json();
        // console.log(responseJson.message);
    }

    if (collectionvalue === "users" || collectionvalue === "workers") {
        generateTable(responseJson, collectionvalue);
    }
    if (collectionvalue === "buyers") {
        // console.log("Buyers")
        generateTable(responseJson, collectionvalue);
    }
}
/**
 * Helper function to generate a table. Generates a table with data from the specified collection.
 *
 * @param {object} workerInfo - The responseJson from `dblookup` containing the data from the collection.
 * @param {string} collectionvalue - Either `users` or `buyers`.
 */
async function generateTable(workerInfo, collectionvalue) {
    mainDiv.innerHTML = content.lookupTable;
    let jobTable = document.createElement("table");
    document.querySelector(".WorkerTable").append(jobTable);
    switch (collectionvalue) {
        case "users": {
            let tableHeader = `<th>Worker name</th><th>Computation status</th> <th>Computations done</th> <th>Delete user</th>`;

            jobTable.insertRow(0).innerHTML = tableHeader;

            workerInfo.message.forEach((element, index) => {
                let row = jobTable.insertRow(index + 1);
                row.insertCell(0).innerHTML = element.name;
                row.insertCell(1).innerHTML = element.compute;
                row.insertCell(2).innerHTML = element.tasks_computed;
                row.insertCell(
                    3
                ).innerHTML = `<button class="delete" id="delete${index}" value="${element.name}">Delete</button>`;
            });
            break;
        }
        case "workers": {
            let tableHeader = `<th>Worker name</th><th>Computations done</th><th>Delete user</th>`;

            jobTable.insertRow(0).innerHTML = tableHeader;

            workerInfo.message.forEach((element, index) => {
                let row = jobTable.insertRow(index + 1);
                row.insertCell(0).innerHTML = element.workerId;
                row.insertCell(1).innerHTML = element.jobs_computed;
                row.insertCell(
                    2
                ).innerHTML = `<button class="delete" id="delete${index}" value="${element.workerId}">Delete</button>`;
            });
            break;
        }
        case "buyers": {
            let tableHeader =
    `<th>Buyer name</th><th>Jobs array</th><th>Delete Buyer</th><th>Reset data</th>`;

    jobTable.insertRow(0).innerHTML = tableHeader;
    workerInfo.message.forEach((element,index) => {
        let row = jobTable.insertRow(index + 1);
        row.insertCell(0).innerHTML = element.name;

        let dropdownElement = document.createElement("select");
        dropdownElement.className = "dropdownElement";

        element.jobs_array.forEach((job, index) => {
            let option = document.createElement("option");
            option.value = job.jobId;
            option.text = job.jobId;
            dropdownElement.add(option);
        });
        // Create a wrapper div
        let wrapperDiv = document.createElement("div");
        wrapperDiv.className = "selectWrapper";
        wrapperDiv.appendChild(dropdownElement);

        row.insertCell(1).append(wrapperDiv);
        row.insertCell(2).innerHTML = `<button class="delete" id="delete${index}" value="${element.name}">Delete</button>`;
        row.insertCell(3).innerHTML = `<button class="clearJobs" id="clearJobs${index}" value="${element.name}">Clear jobs</button>`;
    });
            break;
        }
    }
}

/**
 * Loads a chart with session data from the MongoDB Database.
 * @throws Will log an error if the fetch fails.
 */
async function loadSessionChart() {
    try {
        mainDiv.innerHTML = content.computationChart;
        const taskchart = document.getElementById("taskchart");
        const workerchart = document.getElementById("workerchart");

        const labels = [];
        const dataTasks = {
            labels: labels,
            datasets: [
                {
                    label: "computations since serverstart",
                    data: [],
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    hidden: false,
                },
                {
                    label: "Subtasks failed since serverstart",
                    data: [],
                    fill: false,
                    borderColor: "rgb(131, 0, 0)",
                    hidden: false,
                },
            ],
        };

        const dataWorker = {
            labels: labels,
            datasets: [
                {
                    label: "Connected workers",
                    data: [],
                    fill: false,
                    borderColor: "rgb(0, 133, 0)",
                    hidden: false,
                },
            ],
        };

        const options = {
            scales: {
                y: {
                    min: 0, // Set the minimum value of the y-axis to 0
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            if (value >= 0) {
                                return value;
                            }
                        },
                    },
                },
            },
        };

        const config = {
            type: "line",
            data: dataTasks,
            options: options,
        };

        const config2 = {
            type: "line",
            data: dataWorker,
            options: options,
        };

        const task_chart = new Chart(taskchart, config);
        const worker_chart = new Chart(workerchart, config2);

        chartinterval = setInterval(async function () {
            console.log("Getting session data...");
            const response = await fetch("/admin/sessiondata", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const responseJson = await response.json();

                labels.push(
                    Math.round(
                        (Date.now() - responseJson.serverdata.serverstart) /
                            1000
                    )
                );
                dataTasks.datasets[0].data.push(
                    responseJson.serverdata.jobsComputed
                );
                dataTasks.datasets[1].data.push(
                    responseJson.serverdata.failedjobs
                );
                dataWorker.datasets[0].data.push(
                    responseJson.serverdata.connectedworkers.length
                );

                task_chart.update();
                worker_chart.update();
            }
        }, 5000);
    } catch (err) {
        console.log(err);
    }
}

// Get the canvas element
