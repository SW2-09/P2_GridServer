export { buyerRouter };
import { JobQueue } from "../Jobtypes/jobQueue.js";
import { matrix_mult_str } from "../Jobtypes/matrix_multiplication/calcAlgorithm.js";
import { plus_str } from "../Jobtypes/plus/calcPlusAlgorithm.js";
import { createFolder, writeFile } from "../utility.js";

import express from "express";
import fileUpload from "express-fileupload";


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

const dirPath = "./JobData/PendingJobs/";

buyerRouter.use(fileUpload());

buyerRouter.post("/upload", async (req, res) => {
  
  try{
    let dynamicDirPath = dirPath + req.user.name + "/";
    let jobtype = req.body.jobType;
    let Jobdata;

    switch (jobtype) {
      case "matrixMult":{
        Jobdata = createMatrixMultJob(req.body, req.user.name);
        break;
      }
      case "plus":{
        Jobdata = createPlusJob(req.body, req.user.name);
        break;
      }
      default:{
        throw new Error("Jobtype not found");
      }
    }
    
    let uploadPath = dynamicDirPath + Jobdata.jobID + ".json";

    //create folder in the PendingJobs folder if not exists, the folder name is the user name
    createFolder(dynamicDirPath);
    //write the file to the new folder created in the PendingJobs folder
    writeFile(uploadPath, Jobdata);
     
  } catch (error) {
    console.log("Uploading: " + error);
    res.send("Uploading: " + error);
  }
  });


function createMatrixMultJob(jobData, jobOwner) {
  const Jobdata = {
    jobID : jobData.jobTitle,
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
  addMatrixToQue(Jobdata.jobID, Jobdata.type, jobOwner, matrix_A, matrix_B);
  console.log(JobQueue.size);
  console.log(JobQueue.head.numOfTasks);

  return Jobdata;
}

function createPlusJob(jobData, jobOwner){
  const Jobdata = {
    jobID : jobData.jobTitle,
    Des  : jobData.jobDescription,
    type : jobData.jobType,
    arr : jobData.uploadFile,
  }

  addPlusToQue(Jobdata.jobID, Jobdata.type, jobOwner, Jobdata.arr);
  console.log(JobQueue.size);
  console.log(JobQueue.head.numOfTasks);

  return Jobdata;
}

 //the array which will hold the sliced matrixes of matrix A

function addMatrixToQue(jobID, jobType, jobOwner, matrix_A, matrix_B){

  let ARows = matrix_A.rows;
  let A = matrix_A.entries;

  let arr = divideMatrices(A, matrix_B, ARows)

  JobQueue.enQueue(jobID, jobType, jobOwner, matrix_mult_str, matrix_B);
  for (let index = 0; index < arr.length; index++) {
    JobQueue.head.subtaskList.enQueue(JobQueue.head.jobId, index, arr[index]);
    JobQueue.head.numOfTasks++;
  }
}

function addPlusToQue(jobID, jobType, jobOwner, entries){
  
  let arr = dividePlus(entries);
  JobQueue.enQueue(jobID, jobType, jobOwner, plus_str);
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


  