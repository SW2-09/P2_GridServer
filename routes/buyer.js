export { buyerRouter };
import { JobQueue } from "../Jobtypes/matrix_multiplication/jobQueue.js";


import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";

const buyerRouter = express.Router();

/* ********************** *
 *    Logout handling     *
 * ********************** */
buyerRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/* TODO LIST:
 * 1. Maybe upload should be async?
 */

/* ********************** *
 *      File upload       *
 * ********************** */

const dirPath = "./uploads/";

buyerRouter.use(fileUpload()); // Enables file upload

buyerRouter.post("/test", (req, res) => {
  const calcMax = Math.pow(500,3);
const matrixsize = 1000;
  let matrix_A = 

{
    entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
    columns: matrixsize,
    rows: matrixsize,
}

let matrix_B = {

    //creating a random matrix of size = matrixsize
    entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
    columns: matrixsize,
    rows: matrixsize,
}

let arr = []; // the array which will hold the sliced matrixes of matrix A
let ARows = matrix_A.rows;
let A = matrix_A.entries;

function divideMatrices(A , B, ARows){
  if (ARows * B.rows * B.columns < calcMax){
      arr.push(A)
      return;
  }
  if (ARows < 2){
      arr.push(A)
      return;
  }
  let slicedMatrixA = A.slice(0,Math.floor(A.length/2));
  //console.log("her er slice 1 " + slicedMatrixA);
  let slicedMatrixA2 = A.slice(Math.floor(A.length/2),A.length);
  //console.log("her er slice 2 " + slicedMatrixA);
  divideMatrices(slicedMatrixA, B, Math.floor(ARows/2));
  divideMatrices(slicedMatrixA2, B, Math.floor(ARows/2));
}

let test = Date.now();
divideMatrices(A, matrix_B, ARows)

    JobQueue.enQueue(test, matrix_B);
      for (let index = 0; index < arr.length; index++) {
    JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
    JobQueue.head.numOfTasks++;
}
console.log(JobQueue);
});

buyerRouter.post("/upload", async (req, res) => {
  try{
    let dynamicDirPath = dirPath + req.user.name + "/";
    createFolder(dynamicDirPath);

    const Jobdata = {
      jobID : req.body.jobTitle + req.user.name,
      Des  : req.body.jobDescription,
      type : req.body.jobType,
      arrA : req.body.uploadFile,
      arrB : req.body.uploadFile2,
    }

    let uploadPath = dynamicDirPath + Jobdata.jobID + ".json";

    let uploaddata = JSON.stringify(Jobdata);

    console.log(uploaddata);
    
     fs.writeFile(uploadPath, JSON.stringify(Jobdata), (error) => {
     if (error){
      throw error;
     }
      else {
      console.log("File uploaded to " + uploadPath);
      res.send(Jobdata.jobID + " was uploaded to " + uploadPath);
    }
   });
  } catch (error) {
    console.log("Uploading: " + error);
    res.send("Uploading: " + error);
  }
  });


//create folder in the uploads folder if not exists, the folder name is the user name
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log("Upload folder created at " + folderPath);
    return true;
  } else {
    console.log("Upload folder already exists at " + folderPath);
    return false;
  }
};


