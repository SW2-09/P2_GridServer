export { buyerRouter };

//const { application } = require("express");
//const express = require("express");
//const path = require("path");
//const fileUpload = require("express-fileupload");
//const fs = require("fs");

import express from "express";
import path from "path";
import fileUpload from "express-fileupload";
import fs from "fs";
//import passport from "passport";
//import bcrypt from "bcryptjs";

const buyerRouter = express.Router();

//Logout handle
buyerRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//buyerRouter.get("/", (req, res) => {
//  res.send("DAMN");
//});

/* TODO LIST:
 * 1. Create upload-folder if it doesn't exist DONE
 * 2. File upload Error handling. DONE
 * 3. Maybe upload should be async?
 */

const dirPath = "./uploads/";
const allowedFileFormat = ["text/csv", "application/json"]; //allow JSON and csv formats
const maxFileSize = 10 * 1024 * 1024; // 10 MB

/* ***********************
 *  File Upload Section *
 ************************ */
//

buyerRouter.use(fileUpload()); // Enables file upload
buyerRouter.post("/upload", (req, res) => {
  try {
    let dynamicDirPath = dirPath + req.user.name + "/";
    createFolder(dynamicDirPath);
    if (!req.files || Object.keys(req.files).length === 0) {
      // If no files were uploaded (i.e. no file was selected)
      //console.log(req.);
      throw new SyntaxError("No files were uploaded.");
    }

    const sampleFile = req.files.sampleFile;
    //const uploadPath = dynamicDirPath + sampleFile.name;

    if (!Array.isArray(sampleFile)) {
      throw new SyntaxError("Files must be sent as an array.");
    }

    sampleFile.forEach((file) => {
    console.log(file.name)
    if (!allowedFileFormat.includes(file.mimetype)) {
      throw new SyntaxError("File format not supported");
    }
    if (file.size > maxFileSize) {
      throw new SyntaxError(
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

  } 
    catch (err) {
    console.log("uploading error: " + err);
    res.send("uploading error: " + err);
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