 export{arr, matrix_B};
 import { expMatrixA, expMatrixB } from "../fileReader";

 //the maxumimum amount of computations we want a single subtask to be
const calcMax = Math.pow(2000,3);
const matrixsize = 3000;
//the two matrices that will be worked on
let matrix_A = expMatrixA;
/*{
    entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
    columns: matrixsize,
    rows: matrixsize,
}*/

let matrix_B = expMatrixB;
/*{
    //creating a random matrix of size = matrixsize
    entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
    columns: matrixsize,
    rows: matrixsize,
}*/

let arr = []; // the array which will hold the sliced matrixes of matrix A
let ARows = matrix_A.rows;
let A = matrix_A.entries;
//console.log(A);

/**
 * @param {Matrix} A the array containing the matrix A
 * @param {Matrix} B the array containing the matrix B
 * @param {number} ARows the number of rows in the matrix A
 * @returns does not return but pushes the slices of rows to an array
 */
function divideMatrices(A , B, ARows){
    if (ARows * B.rows * B.columns < calcMax){
        arr.push(A)
        return;
    }
    if (ARows < 2){
        arr.push(A)
        return;
    }
    let slicedMatrixA = A.slice(0,Math.floor(A.length/2));
    //console.log("her er slice 1 " + slicedMatrixA);
    let slicedMatrixA2 = A.slice(Math.floor(A.length/2),A.length);
    //console.log("her er slice 2 " + slicedMatrixA);
    divideMatrices(slicedMatrixA, B, Math.floor(ARows/2));
    divideMatrices(slicedMatrixA2, B, Math.floor(ARows/2));
}

divideMatrices(A, matrix_B, ARows)

//console.log(arr.length);
// console.log("hejsa " + arr[0]);

// let finished = [];
// for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr[i].length; j++) {
//         finished.push(arr[i][j])
//     }
// }

// console.log("finished = ");
// console.log(finished);



