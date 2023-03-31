const express = require("express");
const workerRoute = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');



//User model
const User = require('../models/User');

//login page
workerRoute.get('/login',(req,res)=>{
  res.render("login");
})


//register page
workerRoute.get('/register',(req,res)=>{
  res.render('register');
})

//register handle
workerRoute.post('/register', (req,res) =>{
  const {name, password, password2, tasks_computed} = req.body;
  let errors = [];

  //Check required fiels
  if(!name || !password || !password2) {
   errors.push({msg: 'Please enter a password'});
  }

  //Check password match
  if(password != password2){
       errors.push({msg: 'Passwords do not match'});
  }

  //Check if there is an error in the array
  if(errors.length > 0){
    res.render('register',{
       errors, 
       name,
       password,
       password2,
       tasks_computed
    });
  } else{
   //validation passed
      User.findOne({name: name})
      .then(user =>{
           if(user){
               //User exists
               errors.push({msg: 'User is taken'});
               res.render('register',{
                   errors: errors, 
                   name: name,
                   password: password,
                   password2: password2,
                   tasks_computed: tasks_computed
                });
           } else{
               const newUser = new User ({
                   name: name,
                   password: password,
                   tasks_computed: tasks_computed 
               });

               //Check the hashed password. Default function
               bcrypt.genSalt(10, (err, salt) => {
                   bcrypt.hash(newUser.password, salt, (err, hash) => {
                     if (err) throw err;
                     newUser.password = hash;
                     newUser
                       .save()
                       .then(user => {
                         res.redirect('/worker/login');
                       })
                       .catch(err => console.log(err));
                   });
                 });
           }
           
           
      })
  }
  
})


//Login handle
workerRoute.post('/login',(req,res,next)=>{
  console.log(req.body)
  passport.authenticate('local',{
      successRedirect: '/worker',
      failureRedirect: '/worker/login'
  })(req, res, next);
})




//Logout handle
workerRoute.get('/logout', (req, res) =>{
  req.logout( err => {
      if(err) { return next(err) }
      res.redirect('/')
      })
    })


/*
// Guide for sending html: https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
workerRoute.get("/", (req, res) => {
  console.log("Worker");
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
      res.render("../views/pages/worker", {
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
const workers = [{ name: "Mogens" }, { name: "Grete" }];
workerRoute.param("workerID", (req, res, next, workerID) => {
  req.workerID = workers[workerID];
  next();
}); */

module.exports = workerRoute;