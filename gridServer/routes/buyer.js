const { application } = require("express");
const express = require("express");
const buyerRouter = express.Router();
const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs");

/* TODO LIST:
 * 1. Create upload-folder if it doesn't exist DONE
 * 2. File upload Error handling. DONE
 * 3. Maybe upload should be async?
 */

const dirPath = "../gridServer/uploads/";
const allowedFileFormat = ["text/csv", "application/json"]; //allow JSON and csv formats
const maxFileSize = 10 * 1024 * 1024; // 10 MB

// Guide for sending html: https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
buyerRouter.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/buyer.html"));
});

/* ***********************
 *  File Upload Section *
 ************************ */
//

buyerRouter.use(fileUpload()); // Enables file upload
buyerRouter.post("/upload", (req, res) => {
  try {
    if (!createFolder(dirPath)) {
      throw new Error("Error creating upload folder");
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      // If no files were uploaded (i.e. no file was selected)
      throw new SyntaxError("No files were uploaded.");
    }
    const sampleFile = req.files.sampleFile;
    const uploadPath = dirPath + sampleFile.name;

    if (!allowedFileFormat.includes(sampleFile.mimetype)) {
      throw new SyntaxError("File format not supported");
    }
    if (sampleFile.size > maxFileSize) {
      throw new SyntaxError(
        "File size is too big. Max support is " + maxFileSize + "MB"
      );
    }
    sampleFile.mv(uploadPath, (err) => {
      if (err) {
        throw new Error(err);
      } else {
        res.send(sampleFile.name + " was uploaded to " + uploadPath);
      }
    });
  } catch (err) {
    console.log("uploading error: " + err);
    res.send("uploading error: " + err);
  }
});

module.exports = buyerRouter;

const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log("Upload folder created at " + folderPath);
    return true;
  } else {
    return false;
  }
};
