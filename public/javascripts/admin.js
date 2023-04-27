const purge = document.getElementById("purge");
const lookup = document.getElementById("Lookup");
const mainDiv = document.getElementById("mainDiv");

const content = {
lookupTable : ` <div class="WorkerTable" id="WorkerTable"> </div>`,
}


purge.addEventListener("click", async () => {
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
            console.log(responseJson.message);
        } else {
            console.log("Error");
        }
    } catch (err) {
        console.log(err);
    }
});

lookup.addEventListener("click", async () => {
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
            console.log(responseJson.message);
        }

        //generateTable(responseJson); 




    } catch (err) {
        console.log("Error");
    }
});

async function generateTable(workerInfo) {
    mainDiv.innerHTML = content.lookupTable;

    let jobTable = document.createElement("table");

    document.querySelector(".WorkerTable").append(jobTable);

    let tableHeader =
        "<th>Index</th> <th>Title</th> <th>Description</th> <th> Type</th> <th> Download solution </th>";

    jobTable.insertRow(0).innerHTML = tableHeader;

    
}