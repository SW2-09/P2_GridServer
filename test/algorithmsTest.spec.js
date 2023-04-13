import{assert} from 'chai'
import{matrix_mult_str} from "../Jobtypes/matrix_multiplication/algorithms.js"


let matrix_mult=new Function('A','B',matrix_mult_str);

let matrix_A = [
    [1, 2],
    [3, 4]
];

let matrix_B = [
    [2, 0],
    [1, 2]
];

let matrix_AB=[
    [4, 4],
    [10, 8]
];
let matrix_BA=[
    [2, 4],
    [7, 10]
];

let matrix_C=[
    [1, -2, 8 , -4],
    [4, -2, -9 , -1],
    [5, 2, 1, 4]
];

let matrix_D=[
    [1, 4, 5 ],
    [-2, -2, 2],
    [8, -9, 1],
    [-4, -1, 4]
];

let matrix_CD=[
    [85, -60, -7],
    [-60 , 102, 3],
    [-7 , 3, 46],
]
let matrix_DC=[
    [42, 0, -23, 12],
    [0 , 12, 4, 18],
    [-23 , 4, 146, -19],
    [12, 18, -19, 33]
]


describe("algorithms",function(){
    describe("matrix_mult",function(){
        it("matrix_mult) should compute correctly for an instance of 2x2 matricies (AB)", function(){
            let result=JSON.stringify(matrix_mult(matrix_A,matrix_B));
            let expected=JSON.stringify(matrix_AB);
            assert.equal(result,expected);

        })
        it("matrix_mult) should compute correctly for an instance of 2x2 matricies (BA)", function(){
            let result=JSON.stringify(matrix_mult(matrix_B,matrix_A));
            let expected=JSON.stringify(matrix_BA);
            assert.equal(result,expected);

        })
        it("matrix_mult) should compute correctly for an instance of 3x4 and 4X3 matricies (CD)", function(){
            let result=JSON.stringify(matrix_mult(matrix_C,matrix_D));
            let expected=JSON.stringify(matrix_CD);
            assert.equal(result,expected);
        })
        it("matrix_mult) should compute correctly for an instance of 3X4 and 4X3 matricies (DC)", function(){
            let result=JSON.stringify(matrix_mult(matrix_D,matrix_C));
            let expected=JSON.stringify(matrix_DC);
            assert.equal(result,expected);
        })
    })
    
})