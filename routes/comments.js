
var express = require("express");
var router  = express.Router({mergeParams: true});
var Beach   = require("../models/beach");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//COMMENTS ROUTES 
//==============================================================================================================
//the islogin will run first and only then page will render 
//when user logged the islogin will call next()
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Beach.findById(req.params.id, function(err, beach){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {beach: beach});
        }
    })
});

router.post("/", isLoggedIn, function(req, res){
   //lookup campground using ID
   Beach.findById(req.params.id, function(err, beach){
       if(err){
           console.log(err);
           res.redirect("/beaches");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               beach.comments.push(comment);
               beach.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/beaches/' + beach._id);
           }
        });
       }
   });
   
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {beach_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
//beaches/._id/comment/._id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/beaches/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/beaches/" + req.params.id);
       }
    });
});

module.exports = router;