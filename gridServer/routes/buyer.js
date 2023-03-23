const { application } = require("express");
const express = require("express");
const buyerRouter = express.Router();
const path = require("path");


// Guide for sending html: https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
buyerRouter.get("/", function (req, res) {
  console.log("Buyer");
  res.sendFile(path.join(__dirname, "../public/buyer.html"));
});

module.exports = buyerRouter;
