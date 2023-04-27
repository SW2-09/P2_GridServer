const purge = document.getElementById("purge");
const lookup = document.getElementById("Lookup");
const sessiondata = document.getElementById("sessiondata");
const mainDiv = document.getElementById("mainDiv");


let chartinterval;

const content = {
lookupTable : ` <div class="WorkerTable" id="WorkerTable"> </div>`,
computationChart: ` <canvas class="taskchart" id="taskchart"></canvas>
                    <canvas class="workerchart" id="workerchart"></canvas>`,
}


sessiondata.addEventListener("click", async () => {
    try {
        
        
        mainDiv.innerHTML = content.computationChart;
        const taskchart = document.getElementById("taskchart");
        const workerchart = document.getElementById("workerchart");


        
        const labels = []
        const dataTasks = {
          labels: labels,
          datasets: [{
            label: 'computations since serverstart',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            hidden: false,
            
          },
          { label: 'Subtasks failed since serverstart',
            data: [],
            fill: false,
            borderColor: 'rgb(131, 0, 0)',
            hidden: false,
            }]
        };

        const dataWorker = {
            labels: labels,
            datasets: [{
              label: 'Connected workers',
              data: [],
              fill: false,
              borderColor: 'rgb(0, 133, 0)',
              hidden: false,
            },]
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
            type: 'line',
            data: dataTasks,
            options: options
          };

        const config2 = {
            type: 'line',
            data: dataWorker,
            options: options
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

            labels.push(Math.round((Date.now() - responseJson.serverdata.serverstart)/1000))
            dataTasks.datasets[0].data.push(responseJson.serverdata.jobsComputed)
            dataTasks.datasets[1].data.push(responseJson.serverdata.failedjobs)
            dataWorker.datasets[0].data.push(responseJson.serverdata.connectedworkers.length)

            task_chart.update();
            worker_chart.update();

        }
        }, 5000);
    //intervalOn = true;
    //}
    

        

    } catch (err) {
        console.log(err);
    }
});

purge.addEventListener("click", async () => {
    clearInterval(chartinterval);
    let collectionvalue = document.getElementById("collection").value;
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

lookup.addEventListener("click", async () => {
    clearInterval(chartinterval);
    let collectionvalue = document.getElementById("collection").value;
    console.log(collectionvalue)
    let responseJson
    try {
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

        if(collectionvalue === "users"){
            generateTable(responseJson, collectionvalue)
        }
        if(collectionvalue === "buyers"){
            // console.log("Buyers")
            generateTable(responseJson, collectionvalue)
            
        }

    } catch (err) {
        console.log("Error");
    }
});


async function generateTable(workerInfo, collectionvalue) {
    mainDiv.innerHTML = content.lookupTable;
    let jobTable = document.createElement("table");
    document.querySelector(".WorkerTable").append(jobTable);

    console.log(Object.keys(workerInfo.message[0]))
    if (collectionvalue === "users") {
    let tableHeader =
        `<th>Worker name</th><th>Computation status</th> <th>Computations done</th>`;

    jobTable.insertRow(0).innerHTML = tableHeader;
    
    workerInfo.message.forEach((element,index) => {
        let row = jobTable.insertRow(index + 1);
        row.insertCell(0).innerHTML = element.name;
        row.insertCell(1).innerHTML = element.compute;
        row.insertCell(2).innerHTML = element.tasks_computed;
        // row.insertCell(3).innerHTML = element.type;
    });
}   else{
    let tableHeader =
    `<th>Buyer name</th><th>Jobs array</th><th>More info</th><th>Delete Buyer</th><th>Reset data</th>`;

    jobTable.insertRow(0).innerHTML = tableHeader;
    workerInfo.message.forEach((element,index) => {
        let row = jobTable.insertRow(index + 1);
        row.insertCell(0).innerHTML = element.name;
        
        
        let dropdownElement = document.createElement("select");
        dropdownElement.className = "dropdownElement";
        

        element.jobs_array.forEach((job, index) => {
            let option = document.createElement("option");
            option.value = job.jobID;
            option.text = job.jobID;
            dropdownElement.add(option);
            
        });
         // Create a wrapper div
    let wrapperDiv = document.createElement("div");
    wrapperDiv.className = "selectWrapper";
    wrapperDiv.appendChild(dropdownElement);

        row.insertCell(1).append(wrapperDiv);
        row.insertCell(2).innerHTML = `<button class="moreInfo" id="moreInfo${index}">More info</button>`;
        row.insertCell(3).innerHTML = `<button class="delete" id="delete${index}">Delete</button>`;
        row.insertCell(4).innerHTML = `<button class="reset" id="reset${index}">Reset data</button>`;
    });
}
}

// Get the canvas element
