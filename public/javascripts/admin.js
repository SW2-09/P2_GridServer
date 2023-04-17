const purge = document.getElementById("purge");
const lookup = document.getElementById("Lookup");

    purge.addEventListener("click", async () => {
        let collectionvalue = document.getElementById("collection").value
        if(confirm("Are you sure you want to purge the collection: " + collectionvalue)=== false ) return;
        try{
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

        if(response.status === 200)
        {  
            const responseJson = await response.json();
            console.log(responseJson.message);
        }
        else
        {
            console.log("Error");
        }

    }catch (err) {
        console.log(err);
    }
    });

    lookup.addEventListener("click", async () => {
        let collectionvalue = document.getElementById("collection").value
        try{
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
        if(response.status === 200)
        {  
            const responseJson = await response.json();
            console.log(responseJson.message);
        }} catch(err) {
            console.log("Error");
        }});