/* TIPS AND TRICKS DURING THE COURSE 
1. Use the "npm init" command to create a package.json file 
2. "npm install --save-dev nodemon" command to install nodemon (see package.json)
3. Use the "npm run devStart" command to start the server (see package.json) 
nodemon can be acti
*/

const port = 3000;

const express = require("express");
const app = express();

app.use(express.static("public")); // Middleware function that serves static files (e.g. css files)
app.use(express.urlencoded({ extended: true })); // Middleware function that parses the body of a request (e.g. form data)
app.use(express.json()); // This allows us to parse json data

app.set("view engine", "ejs"); // Makes .ejs files possible to use

//Q: Please recreate the app.get function to refer to the public folder and render the index.ejs file

app.get("/", (req, res) => {
  res.render("public", { text: "World" });
});

/* ** ROUTES **
This is great practice to get into. This way we can have different nested routes in different files.
1. Keeps the code clean and easy to read and to maintain.
2. Each route can be in its own file.
3. e.g. server.js -> routes/users.js -> routes/users/new.js
*/
const userRouter = require("./routes/users"); // Import the router from the users.js file
app.use("/users", userRouter); // Use the router for all routes that start with /users (see users.js)

//Example of a middleware function that is only used for the "/" route
function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}

app.listen(port, () =>
  console.log(`Server has been started on http://localhost:${port}`)
);
