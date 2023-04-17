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
const allowedFileFormat = ["text/csv", "application/json"]; //allows JSON and csv formats
const maxFileSize = 10 * 1024 * 1024; // 10 MB

buyerRouter.post("/test", (req, res) => {
  
  console.log(req.body);
});

buyerRouter.use(fileUpload()); // Enables file upload
buyerRouter.post("/upload", (req, res) => {
  const Jobdata = {
    name : req.body.jobTitle,
    Des  : req.body.jobDescription,
    type : req.body.jobType,
    arrA : 0,
    arrB : 0,
  }
  let data = [];
  console.log(Jobdata);
  
  try {
    
    console.log(req.body);
    let dynamicDirPath = dirPath + req.user.name + "/";
    createFolder(dynamicDirPath);

    const files = Object.values(req.files); // list of files from request
    files.forEach((file, index) => {
      //console.log(file);
      if (!file || Object.keys(file).length === 0) {
        // If no files were uploaded (i.e. no file was selected)
        //console.log(req.);
        throw new Error("No files were uploaded.");
      }

      //const uploadPath = dynamicDirPath + sampleFile.name;

      console.log(file.name);
      if (!allowedFileFormat.includes(file.mimetype)) {
        throw new Error("File format not supported");
      }
      if (file.size > maxFileSize) {
        throw new Error(
          "File size is too big. Max support is " + maxFileSize + "MB"
        );
      }
      let uploadPath = dynamicDirPath + index;
            
      file.mv(uploadPath, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          console.log("File uploaded to " + uploadPath);
          //res.send(sampleFile.name + " was uploaded to " + uploadPath);
        }
      });
    });
    Jobdata.arrA = data[0];
    Jobdata.arrB = data[1];
  } catch (err) {
    console.log("Uploading: " + err);
    //res.send("Uploading: " + err);
  }
  res.redirect("/buyer");
});

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

/* MULTI UPLOAD BACKUP


buyerRouter.post("/upload", (req, res) => {
  try {
    let dynamicDirPath = dirPath + req.user.name + "/";
    createFolder(dynamicDirPath);
    if (!req.files || Object.keys(req.files).length === 0) {
      // If no files were uploaded (i.e. no file was selected)
      //console.log(req.);
      throw new Error("No files were uploaded.");
    }

    const sampleFile = req.files.sampleFile;
    //const uploadPath = dynamicDirPath + sampleFile.name;

    if (!Array.isArray(sampleFile)) {
      throw new Error("Files must be sent as an array.");
    }

    sampleFile.forEach((file) => {
      console.log(file.name);
      if (!allowedFileFormat.includes(file.mimetype)) {
        throw new Error("File format not supported");
      }
      if (file.size > maxFileSize) {
        throw new Error(
          "File size is too big. Max support is " + maxFileSize + "MB"
        );
      }
    });

    sampleFile.forEach((file) => {
      let uploadPath = dynamicDirPath + file.name;

      file.mv(uploadPath, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          console.log("File uploaded to " + uploadPath);
          //res.send(sampleFile.name + " was uploaded to " + uploadPath);
        }
      });
    });
  } catch (err) {
    console.log("Uploading: " + err);
    res.send("Uploading: " + err);
  }
  res.redirect("/buyer");
});
*/
