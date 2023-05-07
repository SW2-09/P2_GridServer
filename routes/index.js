export { router };

import express from "express";
import {
    checkLoggedIn,
    ensureAuthenticated,
    checkRole,
} from "../config/authentication.js";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Buyer } from "../models/Buyer.js";
import { sanitize } from "../utility.js";


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
    const name = sanitize(req.user.name);
    res.render("buyer", { name: name });
});

//admin page
router.get("/admin", checkRole("admin"), (req, res) => {
    const name = sanitize(req.user.name);
    res.render("admin", { name: name });
});

router.post("/register", (req, res) => {
    const name = sanitize(req.body.name);
    const password = sanitize(req.body.password);
    const password2 = sanitize(req.body.password2);
    
    let errors = [];

    if (!name || !password || !password2) {
        if (!name && !password && !password2) {
            errors.push({ msg: "Please enter all fields" });
        } else if (!name) {
            errors.push({ msg: "Please enter a name" });
        } else if (!password || !password2) {
            errors.push({ msg: "Please enter a password" });
        }
    } else if (password !== password2) {
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
    const name = sanitize(req.body.name);
    console.log(req.body);
    if (name == "admin") {
        passport.authenticate("local", {
            failureFlash: true,
            successRedirect: "/admin",
            failureRedirect: "/login",
        })(req, res, next);
    } else {
        passport.authenticate("local", {
            failureFlash: true,
            successRedirect: "/buyer",
            failureRedirect: "/",
        })(req, res, next);
    }
});
