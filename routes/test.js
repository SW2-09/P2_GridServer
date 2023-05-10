export { testRouter };

import express from "express";
import path from "path";

const testRouter = express.Router();

//C:\Users\Bruger\Documents\GitHub\P2_GridServer\public\test.html

let relativePathTest = "public/test.html";
let absolutePathTest = path.resolve(relativePathTest);

testRouter.get("/", (req, res) => {
    res.sendFile(absolutePathTest);
});
//"C:/Users/Bruger/Documents/GitHub/P2_GridServer/public/test.html"
