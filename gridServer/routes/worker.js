const { application } = require("express");
const express = require("express");
const workerRoute = express.Router();
const path = require("path");

// Guide for sending html: https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
workerRoute.get("/", (req, res) => {
  console.log("Worker");
  res.sendFile(path.join(__dirname, "../public/worker.html"));
});

workerRoute.use(
  "/:workerID",
  (req, res, next) => {
    console.log("Request URL: " + req.originalUrl);
    next();
  },
  (req, res, next) => {
    console.log("Request Type: " + req.method);
    next();
  }
);

workerRoute.get(
  "/:workerID",
  (req, res, next) => {
    if (req.params.workerID < workers.length) {
      res.render("index", {
        worker: workers[req.params.workerID].name,
        error: null,
      });
      console.log("worker: " + workers[req.params.workerID].name);
      //next(queue);
    } else next();
  },
  (req, res, next) => {
    // render a regular page
    res.send("Worker does not exists");
  }
);

/*
workerRoute.post("/", (req, res) => {
  if (true) {
    workers.push({ name: req.body.name });
    res.redirect(`workers/${workers.length - 1}`);
  } else {
    console.log("Error");
  }
});

workerRoute.route("/:workerID").get((req, res) => {
  console.log(req.workerID);
});
*/

const workers = [{ name: "Mogens" }, { name: "Grete" }];

workerRoute.param("workerID", (req, res, next, workerID) => {
  req.workerID = workers[workerID];
  next();
});

module.exports = workerRoute;
