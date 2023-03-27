/* ** NOTES **
1. Use the "npm init" command to create a package.json file 
2. "npm install --save-dev nodemon" command to install nodemon (see package.json)
3. Use the "npm run devStart" command to start the server (see package.json) 
nodemon can be acti
*/

const port = 8080;

const express = require("express");
const app = express();

app.use(express.static("public")); // Middleware function that serves static files (e.g. css files) https://expressjs.com/en/starter/static-files.html
app.use(express.urlencoded({ extended: true })); // Middleware function that parses the body of a request (e.g. form data)
app.use(express.json()); // This allows us to parse json data

app.set("view engine", "ejs"); // Makes .ejs files possible to use

//index page
app.get("/", (req, res) => {
  res.render('pages/index');
});

//worker page
app.get("/worker", (req, res) => {
  res.render('pages/worker');
});


/* ** ROUTES **
This is great practice to get into. This way we can have different nested routes in different files.
1. Keeps the code clean and easy to read and to maintain.
2. Each route can be in its own file.
3. e.g. server.js -> routes/users.js -> routes/users/new.js
*/

const workerRoute = require("./routes/worker");
app.use("/worker", workerRoute);
/*
const userRoute = require("./routes/user");
app.use("/users", userRoute);
*/

app.listen(port, () =>
  console.log(`Server has been started on http://localhost:${port}`)
);
