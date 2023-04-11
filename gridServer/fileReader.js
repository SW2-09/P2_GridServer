export {exportmatrix};
let exportmatrix = [];
let uploadButton = document.getElementById('uploadButton');

uploadButton.addEventListener('click', 
() => {
    parseCsvToJson(document.getElementById('uploadFile').files[0]);
});

function parseCsvToJson(file){
    let matrix = [];
    Papa.parse(file, // import a file and sets it to uploadFile
    {
        download: true,
        header: false,
        skipEmptyLines: true, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        complete: function(results){
            let placeholder = []; 
            //the placeholder represents the rows of the matrix which then can be pushed to the matrix array
           
            for (i = 0; i < results.data.length; i++) { 
                for (let j = 0; j < results.data[i].length; j++) {
                    if (results.data[i][j])
                        placeholder.push(parseFloat(results.data[i][j]));
                }

                matrix.push(placeholder);
                placeholder = [];
            };

            console.log("matrix")
            console.log(matrix);
            exportmatrix = matrix;
        }
    })
}
