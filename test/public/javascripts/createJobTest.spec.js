import { randomMatrix } from "../../helper_functions.js";
import { assert } from "chai";
import crypto from "crypto";

describe("createJob.js", () => {
    describe("validateMatrix", () => {
        it("Should validate the uploaded matrix (client specific)", () => {
            let corruptMatrix = testMatrix;

            corruptMatrix[50][50] = "A";
            assert.isTrue(validateMatrix(corruptMatrix, corruptMatrix));
        });
    });
});

let testMatrix = randomMatrix(100, 100, 100);

function insertCharInMatrix( matrix, rows, columns,index) {
    let row = rows * Math.random();
    let coloumn = columns * Math.random();

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
        alert(err + " Please choose valid matricies.");
        return false;
    }
    return true;
}
