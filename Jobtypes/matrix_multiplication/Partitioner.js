export{matrix_mult}
// let matrix_B = {
    //     entries: [[1,2,3],
    //               [4,5,6],
    //               [7,8,9]],
    //     columns: matrixsize,
    //     rows: matrixsize,
    // }
    
    // let matrix_A = {
        //     entries: [[1,2,3],
//              [4,5,6],
//              [7,8,9]],
//     columns: matrixsize,
//     rows: matrixsize,
// }


const matrixsize = 2200;

//the two matrices that will be worked on
let matrix_B = {
    //creating a random matrix of size = matrixsize
    entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
    columns: matrixsize,
    rows: matrixsize,
}

let matrix_A = {
    entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
    columns: matrixsize,
    rows: matrixsize,
}

// creator funtion to create subtask containing an ID, and the matrices that should be multiplied together
function createSubtask(id,matrixA,matrixb){
    this.id = id;
    this.matrixA = matrixA;
    this.matrixb = matrixb;
}


/**
 * multiplies the first given matrix with the second (A*B)
 * @param {Matrix} A 
 * @param {Matrix} B 
 * @returns false if the matrices are not compatible for multiplication, or the resulting matrix of the matrix multiplication
 */
function matrix_mult(A,B){
    let AColumns = A[0].length;
    let ARows = A.length;
    let BColumns = B[0].length;
    let BRows = B.length;
    if (AColumns !== BRows){ 
        //if the number of columns in A is not the same as the number of rows in B, matrix multiplication is not possible
        console.log("Matrix multiplication not possible with given matrices");
        return false;
    }
    // creating the resulting matrix
    let matrix_AxB = new Array(ARows);
    for (let index = 0; index < ARows; index++) {
        matrix_AxB[index] = new Array(BColumns);
    }

    let count = 0;

    for (let ACurrentRows = 0; ACurrentRows < ARows; ACurrentRows++) { // count the rows of matrix A up
        //console.log(ACurrentRows);
        for (let BCurrentColumns = 0; BCurrentColumns < BColumns; BCurrentColumns++) {// counts the columns of matrix B up
            for (let index = 0; index < BRows; index++) { 
                // multiplies the corresponding indexes of the row of A and the indexes of the column of B
                count += A[ACurrentRows][index]*B[index][BCurrentColumns];
            } 
            matrix_AxB[ACurrentRows][BCurrentColumns] = count;  
            count = 0;
        }
    }
    return matrix_AxB;
}

// let slicedMatrixA = matrix_A.entries.slice(0,Math.floor(matrix_A.entries.length/2));
// let slicedMatrixA2 = matrix_A.entries.slice(Math.floor(matrix_A.entries.length/2),matrix_A.entries.length);

// task1 = new createSubtask(1,slicedMatrixA,matrix_B.entries);
// task2 = new createSubtask(1,slicedMatrixA2,matrix_B.entries);

// // let subtask1 = matrix_mult(task1.matrixA,task1.matrixb);
// // let subtask2 = matrix_mult(task2.matrixA,task2.matrixb);

// /**
//  * will add the matrix B  at the end of matrix A
//  * @param {Matrix} A 
//  * @param {Matrix} B 
//  * @returns the combined matrix of matrix A and B
//  */
// function combinematrix(A,B){
//     return A.concat(B);
// }
// let tidStart = Date.now();
// let noget = matrix_mult(matrix_A.entries,matrix_B.entries);

// // let finish = combinematrix(subtask1,subtask2);
// let tid = Date.now() - tidStart;
// console.log("tid i sekunder " + tid/1000)
// // console.log(finish);

// /**
//  * test function that test the multiplication code and the combination code 
//  */
// function testMatrixOperation(){
//     let matrix_A = [
//         [1, 2],
//         [3, 4]
//     ];

//     let matrix_B = [
//         [2, 0],
//         [1, 2]
//     ];

//     // Test matrix_mult
//     let expectedMatrixMult = [
//         [4, 4],
//         [10, 8]
//     ];

//     let multiplyresult = matrix_mult(matrix_A,matrix_B);
//     if (JSON.stringify(expectedMatrixMult) === JSON.stringify(multiplyresult))
//         console.log("multiply test passed");
//     else
//         console.log("multiply test failed");

//     let expectedCombinedmatrix = [
//         [1, 2],
//         [3, 4],
//         [2, 0],
//         [1, 2]
//     ];
//     let combineresult = combinematrix(matrix_A,matrix_B);
//     if (JSON.stringify(expectedCombinedmatrix) === JSON.stringify(combineresult))
//         console.log("combine test passed");
//     else
//         console.log("combine test failed");
// }

// testMatrixOperation();