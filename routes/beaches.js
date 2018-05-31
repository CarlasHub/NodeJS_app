var express = require("express");
var router  = express.Router();
var Beach   = require("../models/beach");



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
router.post('/', function(req, res){
    //get data from form and add to grounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newBeach = {name: name, image: image, description: desc};
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
//NEW show form to create 
router.get('/new', function(req ,res){
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

module.exports = router;
