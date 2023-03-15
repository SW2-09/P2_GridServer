/*
let matrix = {
    rows: 3,
    columns:  3,
    entries: [1,4,7,2,5,8,3,6,9]
};
const start = Date.now();

const A = Array(100000) // array size is 10
				.fill()
				.map(() => 50 * Math.random()); // numbers from 0-50 (exclusive)

const B = Array(500000) // array size is 10
				.fill()
				.map(() => 50 * Math.random()); // numbers from 0-50 (exclusive)
let count = 0;
for (let index = 0; index < A.length; index++) {
    for (let j = 0; j < B.length; j++) {
        count += 1;
        A[index]*B[j]+A[index]*B[j];
        
    }
    
}
console.log(count);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
*/

let matrix_B = {
    entris: [[5,6,7],[7,8,9],[1,2,3]],
    columns: 3,
    rows: 3,
}

let matrix_A = {
    entris: [[1,2],[6,3],[1,8]],
    columns: 3,
    rows: 2,
}

function matrix_mult(A,B){
    if (A.columns !== B.rows){
        console.log("Matrix multiplication not possible with given matrices");
        return false;
    }
    let matrixAxB = new Array(B.columns);
    for (let index = 0; index < B.columns; index++) {
        matrixAxB[index] = new Array(A.rows);
    }
    let matrixA = A.entris;
    let matrixB = B.entris;
    let count = 0;

    for (let A_rows = 0; A_rows < A.rows; A_rows++) {
        for (let B_columns = 0; B_columns < B.columns; B_columns++) {
            for (let index = 0; index < B.rows; index++) {
                count += A.entris[index][A_rows]*B.entris[B_columns][index];
            } 
            matrixAxB[A_rows][B_columns] = count;  
            count = 0;
        }
    }

    for (let index = 0; index < A.rows; index++) {
        for (let j = 0; j < B.columns; j++) {
            console.log(matrixAxB[index][j] +" ");
        }
        console.log("newline");
    }
    return matrixAxB;
}

matrix_mult(matrix_A,matrix_B);


