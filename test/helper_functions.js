export { makeMatrixPair, randomMatrix };

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
