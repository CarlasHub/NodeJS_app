var express = require("express");
var router  = express.Router();
var Beach   = require("../models/beach");
var middleware = require("../middleware");



//INDEX -SHOW ALL
router.get("/", function(req, res){
    //show me the user
   // console.log(req.user);
    // Get all from DB
    Beach.find({}, function(err, allbeaches){
       if(err){
           console.log(err);
       } else {
           //need to pass current user in every single route , currentUser: req.user
          res.render("beaches/index",{ beaches :allbeaches });
       }
    });
});
    
//CREATE ROUTE -add new beach
//install body-parser so this can run sucessfuly  
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    // Create a new Beach and save to DB
    var newBeach = {name: name, image: image, description: desc, author: author };
    // Create a new beach and save to DB with user input 
    Beach.create(newBeach, function(err, newitem){
        if(err){
            console.log(err);
        } else {
            //redirect back to beaches page
          
            res.redirect("/beaches");
        }
    });
});
//NEW SHOW form to create 
router.get('/new',middleware.isLoggedIn, function(req ,res){
    res.render('beaches/new');
});

//SHOW - show more info about the beach / this must become after the new declaration 
router.get("/:id", function(req, res){
    //find the beach with provided ID
    Beach.findById(req.params.id).populate("comments").exec(function(err, foundBeach){
        if(err){
            console.log(err);
        } else {
            //render show template 
            res.render("beaches/show", {beach: foundBeach});
        }
    });
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


// EDIT BEACH ROUTE
router.get("/:id/edit", middleware.checkBeachOwnership, function(req, res){
     Beach.findById(req.params.id, function(err, foundBeach){
        res.render("beaches/edit", {beach: foundBeach});
      });
});

// UPDATE BEACH ROUTE
router.put("/:id",middleware.checkBeachOwnership, function(req, res){
    // find and update the correct campground
    Beach.findByIdAndUpdate(req.params.id, req.body.beach, function(err, updatedBeach){
       if(err){
           res.redirect("/beaches");
       } else {
           //redirect somewhere(show page)
           res.redirect("/beaches/" + req.params.id);
       }
    });
});

// DESTROY BEACH ROUTE
router.delete("/:id",middleware.checkBeachOwnership, function(req, res){
   Beach.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/beaches");
      } else {
          res.redirect("/beaches");
      }
   });
});


module.exports = router;
