/*
Notes to myself:

The following could also be included in the server.js file, 
but it is better to separate the routes into different files.
 
This file is nested inside the parent route in server.js (everything starts with /users).
*/

const { application } = require("express");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.query.name); // e.g. http://localhost:3000/users?name=John will print "John"
  res.send("Users");
});

router.get("/new", (req, res) => {
  //static route with no parameters
  res.render("users/new", { userName: "xxx" });
});

router.post("/", (req, res) => {
  const isValid = true;
  if (isValid) {
    users.push({ userName: req.body.userName });
    res.redirect(`/users/${users.length - 1}`);
  } else {
    console.log("Error");
    res.render("users/new", { userName: req.body.userName });
  }
});

/* ** ROUTE PARAMETERS ** 
Express reads code from top to bottom, therefore, route parameters should be placed after the other routes.
if routes are static, they should be placed before the route parameters.
*/

router
  .route("/:userId")
  .get((req, res) => {
    console.log(req.user);
    res.send("Get user with ID " + req.params.userId);
  })
  .put((req, res) => {
    res.send("Update user with ID " + req.params.userId);
  })
  .delete((req, res) => {
    res.send("Delete user with ID " + req.params.userId);
  });

/* ** Middleware **
"Whenever you go to a route that has a :userId parameter, then run this function"
Middelware runs inbetween the request and the response.
*/
const users = [{ name: "john" }, { name: "Claes" }];
router.param("userId", (req, res, next, userId) => {
  req.user = users[userId];
  next(); // Runs the next function in the chain
});

module.exports = router; // Export the router to be used in server.js
