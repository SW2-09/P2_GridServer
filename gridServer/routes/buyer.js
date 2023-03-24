const { application } = require("express");
const express = require("express");
const buyerRouter = express.Router();
const path = require("path");

// Guide for sending html: https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
buyerRouter.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/buyer.html"));
});

const upload = require("express-fileupload");

module.exports = buyerRouter;
