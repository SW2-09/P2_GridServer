/* ** NOTES **
1. Use the "npm init" command to create a package.json file 
2. "npm install --save-dev nodemon" command to install nodemon (see package.json)
3. Use the "npm run devStart" command to start the server (see package.json) 
nodemon can be acti
*/

const port = 8080;

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport')
const session = require('express-session')

const app = express();

app.use(express.static("public")); // Middleware function that serves static files (e.g. css files) https://expressjs.com/en/starter/static-files.html
// app.use(express.urlencoded({ extended: true })); // Middleware function that parses the body of a request (e.g. form data)
app.use(express.json()); // This allows us to parse json data

//User model
const User = require('./models/User');


//passport config
require('./config/passport')(passport)

//MongoDB Atlas config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB is connected'))
    .catch(err => console.log(err));

//EJS setup
app.use(expressLayouts);
app.set("view engine", "ejs"); // Makes .ejs files possible to use


//Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Bodyparser
app.use(express.urlencoded({extended: false}));

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//index page
app.use('/', require('./routes/index'))

//worker page
app.use('/',require('./routes/worker'))


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