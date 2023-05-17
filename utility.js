//create folder in the uploads folder if not exists, the folder name is the user name
import fs from "fs";

/**
 * Creates a new directory at specified `folderpath`.
 *
 * @param {string} folderPath - Folderpath to create a folder at.
 * @returns {boolean} `true` if succes, `false` otherwise.
 */
export function createFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log("Upload folder created at " + folderPath);
        return true;
    } else {
        console.log("Upload folder already exists at " + folderPath);
        return false;
    }
}

/**
 * Uses fs.writeFile to write data to a specified file.
 *
 * @param {string} uploadPath - The path write the data to
 * @param {object} Jobdata - The data to be written to the file.
 * @throw Will throw an error if the writing fails.
 */
export function writeFile(uploadPath, Jobdata) {
    fs.writeFile(uploadPath, JSON.stringify(Jobdata), (error) => {
        if (error) {
            throw error;
        } else {
            console.log("File uploaded to " + uploadPath);
        }
    });
}

/**
 * Sanitizes a string by removing potentially undesired characters.
 * @param {string} str - The string to be sanitzed.
 * @returns {string} The sanitized string.
 */
export function sanitize(str) {
    str = str
        .replace(/&/g, "")
        .replace(/</g, "")
        .replace(/>/g, "")
        .replace(/"/g, "")
        .replace(/'/g, "")
        .replace(/`/g, "")
        .replace(/\//g, "")
        .replace(/ /g, "_");
    return str.trim();
}
