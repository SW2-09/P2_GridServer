/* ** NOTES **
1. Use the "npm init" command to create a package.json file 
2. "npm install --save-dev nodemon" command to install nodemon (see package.json)
3. Use the "npm run devStart" command to start the server (see package.json) 
nodemon can be acti
*/
export { serverdata };
import { startWebsocketserver } from "./web_socket/handlers.js";

const host = "localhost";
const port = 3000;
const webSocketPort = 3443;

import express from "express";
import expressLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import mongoDBStore from "connect-mongodb-session";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import status from "express-status-monitor";


//const express = require("express");
const app = express();

app.use(status());

app.use(express.static("public")); // Middleware function that serves static files (e.g. css files) https://expressjs.com/en/starter/static-files.html
app.use(express.urlencoded({ extended: true })); // Middleware function that parses the body of a request (e.g. form data)
app.use(express.json({ limit: "100mb" })); // This allows us to parse json data


//Passport config
import { checkPassport } from "./config/passport.js";
checkPassport(passport);

//MongoDB atlas config
import { MongoURI as db } from "./config/keys.js";
import { sessionsURI } from "./config/keys.js";

//Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

//Storage for sessions
const sessiontStore = mongoDBStore(session);
const store = new sessiontStore({
    uri: sessionsURI,
    collection: "Gridserver",
});

//EJS setup
app.use(expressLayouts);
app.set("view engine", "ejs"); // Makes .ejs files possible to use
app.use(flash());

//Express session -  passport session (webpage)
app.use(
    session({
        name: "Gridserver",
        secret: "GridSecret",
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
    })
);

//Bodyparser
//app.use(express.urlencoded({ extended: false }));

//Passport middleware
app.use(passport.initialize()); //This is needed to initialize passport
app.use(passport.session()); //This is needed to keep the user logged in


import { checkRole } from "./config/authentication.js";
//Buyer page routing
import { buyerRouter } from "./routes/buyer.js";
app.use("/buyer", checkRole("buyer"), buyerRouter);

//Index page routing
import { router } from "./routes/index.js";
app.use("/", router);

//Admin page routing
import { adminRouter } from "./routes/admin.js";

app.use("/admin", checkRole("admin"), adminRouter);

/* ** ROUTES **
This is great practice to get into. This way we can have different nested routes in different files.
1. Keeps the code clean and easy to read and to maintain.
2. Each route can be in its own file.
3. e.g. server.js -> routes/users.js -> routes/users/new.js
*/

const serverstart = Date.now();

const serverdata = {
    failedjobs: 0,
    jobsComputed: 0,
    serverstart: serverstart,
    connectedworkers: [],
};

app.listen(port, () =>
    console.log(`Server has been started on http://localhost:${port}`)
);

startWebsocketserver(host, webSocketPort);
