var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware");

// ===================
//    COMMENTS NEW
// ===================
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
});

// ===================
//    COMMENTS CREATE
// ===================
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
   // lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){ // found the correct campground
      if(err){
          req.flash("error", "Campground not found");
          console.log(err);
          res.redirect("/campgrounds");
      } else{
          // if successful, create comment for the campground when the form is submitted
          Comment.create(req.body.comment, function(err, comment){ // create a comment for that correct campground
             if(err){
                req.flash("error", "Something went wrong");
                console.log(err);
             } else{
                 // get the username and id to pass through to the comment Schema
                 comment.author.id = req.user._id; // on the post request, get the user._id store it in comment.author.id
                 comment.author.username = req.user.username; //on the post request, get the username and store it in comment.author.username
                 comment.save(); // then save this comment schema to the database
                 campground.comments.push(comment); // then push this comment to the comments array
                 campground.save(); // then save the entire campground with this new comment made by the author
                 req.flash("success", "Your comment was successfully added");
                 res.redirect("/campgrounds/" + campground._id); // then redirect them to this comment which will now show the username and comment
             }
          });
      }
   });
});

// ===================
//    COMMENTS EDIT
// ===================
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// ===================
//    COMMENTS UPDATE
// ===================
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else{
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// ===================
//    COMMENTS DESTROY
// ===================
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //res.send("THIS WILL BE THE DELETE ROUTE");
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Your comment has been deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;
