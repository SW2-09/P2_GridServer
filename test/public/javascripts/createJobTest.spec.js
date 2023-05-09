import { randomMatrix } from "../../helper_functions.js";
import { assert } from "chai";
import crypto from "crypto";

describe("createJob.js", () => {
    describe("validateMatrix", () => {
        it("Should validate the uploaded matrix (client specific)", () => {
            let testMatrix = randomMatrix(100, 100, 100);
            let corruptMatrix = insertCharInMatrix(testMatrix, 100, 100, 500);

            assert.isTrue(validateMatrix(corruptMatrix, corruptMatrix));
        });
    });
});



function insertCharInMatrix(matrix, rows, columns, index) {
    let row = Math.floor(rows * Math.random());
    let coloumn = Math.floor(columns * Math.random());
    console.log(row,coloumn);

    console.log("hehj");
    console.log(matrix[row][coloumn]);
    matrix[row][coloumn] = characters[index];

    return matrix;
}

let characters = "";
for (let i = 0; i < 7425; i++) {
    characters += String.fromCharCode(i);
}

/**
 *
 * @param {array} matrixA
 * @param {array} matrixB
 * @returns Boolean if succesfuly
 */
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

