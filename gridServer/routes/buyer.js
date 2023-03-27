const { application } = require("express");
const express = require("express");
const buyerRouter = express.Router();
const path = require("path");
const fileUpload = require("express-fileupload");
const { rejects } = require("assert");
const { resolve } = require("path");

/* TODO LIST:
 * 1. Create upload-folder if it doesn't exist
 * 2.
 */

const dirPath = "../gridServer/uploads/";
const allowedFileFormat = ["csv", "json"];
const maxFileSize = 10 * 1024 * 1024; // 10 MB

// Guide for sending html: https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
buyerRouter.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/buyer.html"));
});

/* ***********************
 *  File Upload Section *
 ************************ */
//
buyerRouter.use(fileUpload());

buyerRouter.post("/upload", (req, res) => {
  return new Promise((resolve, reject) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      // If no files were uploaded (i.e. no file was selected)
      reject(new Error("No files were uploaded."));
    }
    const sampleFile = req.files.sampleFile;
    const uploadPath = dirPath + sampleFile.name;

    if (!allowedFileFormat.includes(sampleFile.mimetype)) {
      reject(new Error("File format not supported"));
    }
    if (sampleFile.size > maxFileSize) {
      reject(
        new Error("File size is too big. Max support is " + maxFileSize + "MB")
      );
    }
    sampleFile.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("File uploaded!");
      }
    });
  });
});

module.exports = buyerRouter;
