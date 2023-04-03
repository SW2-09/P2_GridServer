let matrixA = [];
let matrixPack = "";

const uploadFile = document.getElementById('uploadComfirmed').addEventListener('click', () => {
    Papa.parse(document.getElementById('uploadFile').files[0],
    {
        download: true, 
        header: false, 
        skipEmptyLines: true, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        complete: function(results){
            console.log(results);
            
            for (i = 0; i < results.data.length; i++) { 
                matrixA.push(results.data[i]);

                for (let j = 0; j < matrixA[i].length; j++) {
                    matrixA[i][j]=Number(matrixA[i][j]);    //Converts the string to a number
                }
            }
            console.log("matrix A")
            console.log(matrixA);
           
            matrixPack += '{ "matrixA": [\n'
            for (let i = 0; i < matrixA.length; i++) {
                if (i > 0)
                    matrixPack += ",\n";
                matrixPack += ("[" + matrixA[i] + "]") ;
            }
            matrixPack += "\n] ";
            console.log("matrix A JSON")
            console.log(matrixPack)
        }   
        
    })
    
});
const uploadFile2 = document.getElementById('uploadComfirmed').addEventListener('click', () => {
    Papa.parse(document.getElementById('uploadFile2').files[0],
    {
        download: true,
        header: false,
        skipEmptyLines: true, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        complete: function(results){
            console.log(results);
            
            for (i = 0; i < results.data.length; i++) { 
                matrixB.push(results.data[i]);

                for (let j = 0; j < matrixB[i].length; j++) {
                    matrixB[i][j]=Number(matrixB[i][j]);    //Converts the string to a number
                }
            }
            console.log("matrix B")
            console.log(matrixB);
           
            matrixPack += ',\n "matrixB": [\n'
            for (let i = 0; i < matrixB.length; i++) {
                if (i > 0)
                    matrixPack += ",\n";
                matrixPack += ("[" + matrixB[i] + "]") ;
            }
            matrixPack += "\n] }";
            console.log("matrix B JSON")
            console.log(matrixPack)

            let jason = JSON.parse(matrixPack);
            console.log(jason.matrixA)
            console.log(jason.matrixB)
        }   
        
    })
    
});
 /*  function combinematrix(A,B){
                return A.concat(B);
            }
          */
         
            // let combinedMatrix = combinematrix(matrixA,matrixB);
            // let combinedMatrix2 = combinematrix(matrixC,matrixD);
            // console.log(combinedMatrix);
            // console.log(combinedMatrix2);