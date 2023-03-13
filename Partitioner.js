let matrix = {
    rows: 3,
    columns:  3,
    entries: [1,4,7,2,5,8,3,6,9]
};

const A = Array(100000) // array size is 10
				.fill()
				.map(() => 50 * Math.random()); // numbers from 0-50 (exclusive)

const B = Array(100000) // array size is 10
				.fill()
				.map(() => 50 * Math.random()); // numbers from 0-50 (exclusive)
let count = 0;
for (let index = 0; index < A.length; index++) {
    for (let j = 0; j < B.length; j++) {
        count += 1;
        A[index]*B[j]+A[index]*B[j];
        
    }
    console.log(count);
}

