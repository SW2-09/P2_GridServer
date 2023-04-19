export { buyerRouter };
import { parseCsvToJson } from "../fileReader.js";



/*
const { application } = require("express");
const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs");
*/
import express from "express";
//import path from "path";
import fileUpload from "express-fileupload";
import Papa from "papaparse";
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


     fs.writeFileSync(uploadPath, JSON.stringify(Jobdata), (error) => {
     if (error) throw error;
     else {
      console.log("File uploaded to " + uploadPath);
      res.send(jobID + " was uploaded to " + uploadPath);
    }
   });
  } catch (error) {
    console.log("Uploading: " + error);
    //res.send("Uploading: " + err);
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
