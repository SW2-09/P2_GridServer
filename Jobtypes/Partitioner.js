export { matrix_mult };

const matrixsize = 2200;

//the two matrices that will be worked on
let matrix_B = {
    //creating a random matrix of size = matrixsize
    entries: Array(matrixsize)
        .fill(0)
        .map(() =>
            Array(matrixsize)
                .fill(0)
                .map(() => Math.floor(Math.random() * 10))
        ),
    columns: matrixsize,
    rows: matrixsize,
};

let matrix_A = {
    entries: Array(matrixsize)
        .fill(0)
        .map(() =>
            Array(matrixsize)
                .fill(0)
                .map(() => Math.floor(Math.random() * 10))
        ),
    columns: matrixsize,
    rows: matrixsize,
};

// creator funtion to create subtask containing an ID, and the matrices that should be multiplied together
function createSubtask(id, matrixA, matrixb) {
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
function matrix_mult(A, B) {
    let AColumns = A[0].length;
    let ARows = A.length;
    let BColumns = B[0].length;
    let BRows = B.length;
    if (AColumns !== BRows) {
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

    for (let ACurrentRows = 0; ACurrentRows < ARows; ACurrentRows++) {
        // count the rows of matrix A up
        //console.log(ACurrentRows);
        for (
            let BCurrentColumns = 0;
            BCurrentColumns < BColumns;
            BCurrentColumns++
        ) {
            // counts the columns of matrix B up
            for (let index = 0; index < BRows; index++) {
                // multiplies the corresponding indexes of the row of A and the indexes of the column of B
                count += A[ACurrentRows][index] * B[index][BCurrentColumns];
            }
            matrix_AxB[ACurrentRows][BCurrentColumns] = count;
            count = 0;
        }
    }
    return matrix_AxB;
}
