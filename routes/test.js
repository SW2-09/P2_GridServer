export { testRouter };

import express from "express";
import path from "path";

const testRouter = express.Router();

let relativePathTest = "public/test/test.html";
let absolutePathTest = path.resolve(relativePathTest);

testRouter.get("/", (req, res) => {
    res.sendFile(absolutePathTest);
});
