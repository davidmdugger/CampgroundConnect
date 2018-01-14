var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE - SHOW LANDING PAGE
router.get("/", function(req, res){
   res.render("landing"); 
});

// ===================
// AUTHENTICATION ROUTES
// ===================

// REGISTER
router.get("/register", function(req, res){
   res.render("register"); 
});


// NEW USER ROUTE
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //req.flash("error", err); // The error is handled by passport
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN
router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }
));

// LOGOUT
router.get("/logout", function(req, res){
   req.logout(); // .logout() is from passport
   req.flash("success", "You logged out successfully");
   res.redirect("/campgrounds"); // if logout is successful, redirect to /campgrounds
});

module.exports = router;
