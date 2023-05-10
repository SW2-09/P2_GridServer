//import { randomMatrix } from "../test/helper_functions.js";

describe("createJob.js", () => {
    describe("validateMatrix", () => {
        it("Should return true if matrix is valid", () => {
            let testMatrix = randomMatrix(10, 10, 100);

            chai.assert.isTrue(validateMatrix(testMatrix, testMatrix));
        });
        it("Should return false if matrix is invalid", () => {
            let corruptedMatrix;
            let countExpected = 10;
            let count = 0;
            let parses = [];

            for (let i = 0; i < 7425; i++) {
                let testMatrix = randomMatrix(10, 10, 100);
                corruptedMatrix = insertCharInMatrix(testMatrix, 10, 10, i);

                if (validateMatrix(testMatrix, testMatrix)) {
                    count++;
                    parses.push(i);
                }
            }
            for (let i = 0; i < parses.length; i++) {
                console.log(characters[parses[i]]);
            }

            chai.assert.equal(count, countExpected);
        });
    });
});

function insertCharInMatrix(matrix, rows, columns, index) {
    let row = Math.floor(rows * Math.random());
    let coloumn = Math.floor(columns * Math.random());
    console.log(row, coloumn);

    console.log(matrix[row][coloumn]);
    matrix[row][coloumn] = String.fromCharCode(index);

    return matrix;
}

function validateMatrix(matrixA, matrixB) {
    try {
        //Check dimensions of matricies
        if (matrixA[0].length !== matrixB.length) {
            throw new Error("Matrix dimensions do not match.");
        }
        // Check MatrixA
        for (let rowA = 0; rowA < matrixA.length; rowA++) {
            for (let colA = 0; colA < matrixA[rowA].length; colA++) {
                if (isNaN(matrixA[rowA][colA])) {
                    throw new Error("Matrix A is corrupted.");
                }
            }
        }
        // Check MatrixB
        for (let rowB = 0; rowB < matrixB.length; rowB++) {
            for (let colB = 0; colB < matrixB[rowB].length; colB++) {
                if (isNaN(matrixB[rowB][colB])) {
                    throw new Error("Matrix B is corrupted.");
                }
            }
        }
    } catch (err) {
        console.log(err + " Please choose valid matricies.");
        return false;
    }
    return true;
}

function randomMatrix(columns, rows, range) {
    let matrix = [];

    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < columns; j++) {
            let sign = Math.round(Math.random()) * 2 - 1;
            matrix[i][j] =
                (sign * Math.round(range * Math.random() * 100)) / 100;
        }
    }

    return matrix;
}

function makeMatrixPair(n, m, l, range) {
    let matrix_A = {
        entries: randomMatrix(n, m, range),
        columns: m,
        rows: n,
    };

    let matrix_B = {
        entries: randomMatrix(m, l, range),
        columns: l,
        rows: m,
    };

    return [matrix_A, matrix_B];
}

let characters = "";
for (let i = 0; i < 7425; i++) {
    characters += parseString.fromCharCode(i);
}

