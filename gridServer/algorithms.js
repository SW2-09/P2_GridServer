export{matrix_mult_str}

// Matrixmultiplication algorithm

let matrix_mult_str=
   `let AColumns = A[0].length;
    let Arows = A.length;
    let Bcolumns = B[0].length;
    let Brows = B.length;
    if (AColumns !== Brows){
        console.log("Matrix multiplication not possible with given matrices");
        return false;
    }
    let matrix_AxB = new Array(Arows);
    for (let index = 0; index < Arows; index++) {
        matrix_AxB[index] = new Array(Bcolumns);
    }
  
    let count = 0;
  
    for (let ACurrentRows = 0; ACurrentRows < Arows; ACurrentRows++) {
        for (let BCurrentColumns = 0; BCurrentColumns < Bcolumns; BCurrentColumns++) {
            for (let index = 0; index < Brows; index++) {
                count += A[ACurrentRows][index]*B[index][BCurrentColumns];
            } 
            matrix_AxB[ACurrentRows][BCurrentColumns] = count;  
            count = 0;
        }
    }
    return matrix_AxB;
    `

    