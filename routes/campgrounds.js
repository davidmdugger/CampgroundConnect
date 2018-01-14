var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var User = require("../models/user");
var middleware = require("../middleware");

// SHOW ALL CAMPGROUDNS
router.get("/campgrounds", function(req, res){
    // GET ALL CAMPGROUNDS FROM THE DB, store them as allCampgrounds
    Campground.find({}, function(err, allCampgrounds){
        // if that causes an error
        if(err){
            // log the error
            console.log(err);
        } else{
            // render the campgrounds.ejs file
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE ROUTE - ADD NEW CAMPGROUNDS | user should be logged in to post new campground
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    // get data from form and to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    // Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            // redirect back to /campgrounds
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE - SHOW FORM | User should be logged in to see new campground form
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - SHOWS MORE INFO ABOUT ONE CAMPGROUND
router.get("/campgrounds/:id", function(req, res){
    // find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            // render show template with that campground
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT ROUTE - find the campground by ID render the edit template
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
       res.render("campgrounds/edit", {campground: foundCampground});
   });
});

// UPDATE ROUTE - find and update the campground with the info pulled from the form, then redirect to the campground
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, req.body.price, function(err, updatedCampground){
      if(err){
          res.redirect("/campgrounds");
      } else{
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// DESTROY ROUTE - find an a campground by ID and remove it
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
