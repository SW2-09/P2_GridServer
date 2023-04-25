//create folder in the uploads folder if not exists, the folder name is the user name
import fs from "fs";

export function createFolder(folderPath){
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log("Upload folder created at " + folderPath);
      return true;
    } 
    else {
      console.log("Upload folder already exists at " + folderPath);
      return false;
    }
  };

export function writeFile(uploadPath, Jobdata){
  fs.writeFile(uploadPath, JSON.stringify(Jobdata), (error) => {
    if (error){
     throw error;
    }
     else {
     console.log("File uploaded to " + uploadPath);
   }
  })};

  export function sanitizeinput(string){};