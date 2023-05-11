describe("createJob.js", () => {
    describe("validateMatrix", () => {
        it("Should return true if matricies have valid entries", () => {
            let testMatrix = randomMatrix(10, 10, 100);

            chai.assert.isTrue(validateMatrix(testMatrix, testMatrix));
        });
        it("Should return false if non-number character is in a matrix", () => {
            let countExpected = 10;
            let count = 0;
            let parses = [];

            for (let i = 0; i < 7425; i++) {
                let testMatrix = randomMatrix(2, 2, 10);
                insertCharInMatrix(testMatrix, 2, 2, i);

                // Printing to see what characters was found to be numbers:
                //let troubleIndicies=[9,10,11,12,32,48,49,50,51,52,53,54,55,56,57,160,5760];
                //if(troubleIndicies.includes(i)){console.log(i, testMatrix);}

                if (validateMatrix(testMatrix, testMatrix)) {
                    count++;
                    parses.push(i);
                }
            }

            chai.assert.equal(count, countExpected);
        });
        it("should return true if matrix dimensions do match", function () {
            let matrixA = randomMatrix(4, 3, 10);
            let matrixB = randomMatrix(6, 4, 10);

            chai.assert.isTrue(validateMatrix(matrixA, matrixB));
        });
        it("should return false if matrix dimensions do not match", function () {
            let matrixA = randomMatrix(4, 4, 10);
            let matrixB = randomMatrix(3, 3, 10);

            chai.assert.isFalse(validateMatrix(matrixA, matrixB));
        });
    });
});

function insertCharInMatrix(matrix, rows, columns, index) {
    let row = Math.floor(rows * Math.random());
    let coloumn = Math.floor(columns * Math.random());

    matrix[row][coloumn] = String.fromCharCode(index);

    return matrix;
}

function validateMatrix(matrixA, matrixB) {
    try {
        //Check dimensions of matricies
        if (matrixA[0].length !== matrixB.length) {
            throw new Error("Matrix dimensions do not match.");
        }
        let troubleChars = [
            "\t",
            "\n",
            "\x0B",
            "\f",
            " ",
            " ",
            String.fromCharCode(160),
            String.fromCharCode(13),
        ];

        // Check MatrixA
        for (let rowA = 0; rowA < matrixA.length; rowA++) {
            for (let colA = 0; colA < matrixA[rowA].length; colA++) {
                if (isNaN(matrixA[rowA][colA])) {
                    throw new Error("Matrix A is corrupted.");
                }
                for (let i = 0; i < troubleChars.length; i++) {
                    if (matrixA[rowA][colA] === troubleChars[i]) {
                        throw new Error("Matrix A is corrupted.");
                    }
                }
            }
        }

        // Check MatrixB
        for (let rowB = 0; rowB < matrixB.length; rowB++) {
            for (let colB = 0; colB < matrixB[rowB].length; colB++) {
                if (isNaN(matrixB[rowB][colB])) {
                    throw new Error("Matrix B is corrupted.");
                }
                for (let i = 0; i < troubleChars.length; i++) {
                    if (matrixB[rowB][colB] === troubleChars[i]) {
                        throw new Error("Matrix B is corrupted.");
                    }
                }
            }
        }
    } catch (err) {
        //alert(err + " Please choose valid matricies.");
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



