export { buyerRouter };
import { JobQueue } from "../Jobtypes/jobQueue.js";
import { matrix_mult_str } from "../Jobtypes/matrix_multiplication/calcAlgorithm.js";
import { plus_str } from "../Jobtypes/plus/calcPlusAlgorithm.js";

import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";

const buyerRouter = express.Router();

const calcMax = Math.pow(500,3);

/* ********************** *
 *    Logout handling     *
 * ********************** */
buyerRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
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

// buyerRouter.post("/test", (req, res) => {
// const calcMax = Math.pow(500,3);
// const matrixsize = 10;
//   let matrix_A = 

// {
//     entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
//     columns: matrixsize,
//     rows: matrixsize,
// }

// let matrix_B = {

//     //creating a random matrix of size = matrixsize
//     entries: Array(matrixsize).fill(0).map(() => Array(matrixsize).fill(0).map(() => Math.floor(Math.random() * 10))),
//     columns: matrixsize,
//     rows: matrixsize,
// }

// let arr = []; // the array which will hold the sliced matrixes of matrix A
// let ARows = matrix_A.rows;
// let A = matrix_A.entries;


// function divideMatrices(A , B, ARows){
//   if (ARows * B.rows * B.columns < calcMax){
//       arr.push(A)
//       return;
//   }
//   if (ARows < 2){
//       arr.push(A)
//       return;
//   }
//   let slicedMatrixA = A.slice(0,Math.floor(A.length/2));
//   //console.log("her er slice 1 " + slicedMatrixA);
//   let slicedMatrixA2 = A.slice(Math.floor(A.length/2),A.length);
//   //console.log("her er slice 2 " + slicedMatrixA);
//   divideMatrices(slicedMatrixA, B, Math.floor(ARows/2));
//   divideMatrices(slicedMatrixA2, B, Math.floor(ARows/2));
// }

// let test = Date.now();

// divideMatrices(A, matrix_B, ARows)

// console.log(arr)

//     JobQueue.enQueue("job1", matrix_B);
//       for (let index = 0; index < arr.length; index++) {
//     JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
//     JobQueue.head.numOfTasks++;
// }
// JobQueue.enQueue("job2", matrix_B);
//       for (let index = 0; index < arr.length; index++) {
//     JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
//     JobQueue.head.numOfTasks++;
// }
// console.log(JobQueue);
// });

buyerRouter.post("/upload", async (req, res) => {
  
  try{
    let dynamicDirPath = dirPath + req.user.name + "/";
    let jobtype = req.body.jobType;
    let Jobdata;

    switch (jobtype) {
      case "matrixMult":{
        Jobdata = createMatrixMultJob(req.body);
        break;
      }
      case "plus":{
        Jobdata = createPlusJob(req.body);
        break;
      }
      default:{
        throw new Error("Jobtype not found");
      }
    }
    
    let uploadPath = dynamicDirPath + Jobdata.jobID + ".json";

    createFolder(dynamicDirPath);
    
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
  } 
  else {
    console.log("Upload folder already exists at " + folderPath);
    return false;
  }
};

function createMatrixMultJob(jobData) {
  const Jobdata = {
    jobID : jobData.jobTitle + jobData.name,
    Des  : jobData.jobDescription,
    type : jobData.jobType,
    arrA : jobData.uploadFile,
    arrB : jobData.uploadFile2,
  }
  let matrix_A = {
    entries: Jobdata.arrA,
    columns: Jobdata.arrA[0].length,
    rows: Jobdata.arrA.length,
  }
  let matrix_B = {
    entries: Jobdata.arrB,
    columns: Jobdata.arrB[0].length,
    rows: Jobdata.arrB.length,
  }

   // the array which will hold the sliced matrixes of matrix A
  addMatrixToQue(Jobdata.jobID, Jobdata.type, matrix_A, matrix_B);
  console.log(JobQueue.size);
  console.log(JobQueue.head.numOfTasks);

  return Jobdata;
}

function createPlusJob(jobData){
  const Jobdata = {
    jobID : jobData.jobTitle + jobData.name,
    Des  : jobData.jobDescription,
    type : jobData.jobType,
    arr : jobData.uploadFile,
  }

  addPlusToQue(Jobdata.jobID, Jobdata.type, Jobdata.arr);
  console.log(JobQueue.size);
  console.log(JobQueue.head.numOfTasks);

  return Jobdata;
}

 //the array which will hold the sliced matrixes of matrix A

function addMatrixToQue(jobID, jobType, matrix_A, matrix_B){

  let ARows = matrix_A.rows;
  let A = matrix_A.entries;

  let arr = divideMatrices(A, matrix_B, ARows)

  JobQueue.enQueue(jobID, jobType, matrix_mult_str, matrix_B);
  for (let index = 0; index < arr.length; index++) {
    JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
    JobQueue.head.numOfTasks++;
  }
}

function addPlusToQue(jobID, jobType, entries){
  
  let arr = dividePlus(entries);
  JobQueue.enQueue(jobID, jobType, plus_str);
  for (let index = 0; index < arr.length; index++) {
    JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
    JobQueue.head.numOfTasks++;
  }
}

function divideMatrices(A, B, ARows) {
  
  let arr = []; // the array which will hold the sliced matrices of matrix A
  
  if (ARows * B.rows * B.columns < calcMax) {
    arr.push(A);
    return arr;
  }
  
  if (ARows < 2) {
    arr.push(A);
    return arr;
  }
  
  let slicedMatrixA = A.slice(0, Math.floor(A.length / 2));
  let slicedMatrixA2 = A.slice(Math.floor(A.length / 2), A.length);

  // Concatenate the returned arrays from the recursive calls
  arr = arr.concat(
    divideMatrices(slicedMatrixA, B, Math.floor(ARows / 2)),
    divideMatrices(slicedMatrixA2, B, Math.floor(ARows / 2))
  );
  return arr;
}

function dividePlus(entries){

  let arr = []; // the array which will hold the smaller problems
  let index = 0
  for (index; 1 < entries.length; index++) {
    arr[index] = [];
    arr[index][0] = entries.pop();
    arr[index][1] = entries.pop();
  }
  if (entries.length == 1) {
      arr[index] = [];
      arr[index][0] = entries.pop();
  }
  console.log(arr);
  return arr;
}


  