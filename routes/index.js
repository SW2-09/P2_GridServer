export { router };

import express from "express";
import {
  checkLoggedIn,
  ensureAuthenticated,
} from "../config/authentication.js";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Buyer } from "../models/Buyer.js";

const router = express.Router();

//login page
router.get("/", checkLoggedIn, (req, res, next) => {
  const errors = req.flash().error || [];
  res.render("login", { errors });
});

//register page
router.get("/register", checkLoggedIn, (req, res) => {
  res.render("register");
});

// buyer pag
router.get("/buyer", ensureAuthenticated, (req, res) => {
  res.render("buyer", { name: req.user.name });
});

//admin page
router.get("/admin", ensureAuthenticated, (req, res) => {
  res.render("admin", { name: req.user.name });
});

router.post("/register", (req, res) => {
  const { name, password, password2 } = req.body;
  let errors = [];

  //Check required fiels
  if (!name || !password || !password2) {
    errors.push({ msg: "Please enter a password" });
  }

  //Check password match
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //Check if there is an error in the array
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      password,
      password2,
    });
  } else {
    //validation passed
    Buyer.findOne({ name: name }).then((buyer) => {
      if (buyer) {
        //Buyer exists
        errors.push({ msg: "Buyer is taken" });
        res.render("register", {
          errors: errors,
          name: name,
          password: password,
          password2: password2,
        });
      } else {
        const newBuyer = new Buyer({
          name: name,
          password: password,
        });

        //Check the hashed password. Default function
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newBuyer.password, salt, (err, hash) => {
            if (err) throw err;
            newBuyer.password = hash;
            newBuyer
              .save()
              .then((buyer) => {
                res.redirect("/");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//Login handle
router.post("/login", (req, res, next) => {
  console.log(req.body);
  if (req.body.name == "admin") {
    passport.authenticate("local", {
      successRedirect: "/admin",
      failureRedirect: "/login",
    })(req, res, next);
  } else {
    passport.authenticate("local", {
      successRedirect: "/buyer",
      failureRedirect: "/",
    })(req, res, next);
  }
});
