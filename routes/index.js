var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");



router.get('/', function(req, res){
    res.render('landing');
    
});


//  =======================================================================================
// AUTH ROUTES
//  ====================================================================================

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic 
router.post("/register", function(req, res){
    //test this with a simple res.send() first
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Beach Me Up " + user.username);
           res.redirect("/beaches"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic...
//when a request comes to login rgis will run first
//you have to include the middleware which is passport auth and only then the callback
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/beaches",
        failureRedirect: "/login"
    }), function(req, res){
});



module.exports = router;
