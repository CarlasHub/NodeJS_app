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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
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

// logic route
router.get("/logout", function(req, res){
    //this logout method comes from the packages installed 
   req.logout();
   res.redirect("/beaches");
});


//the user only can add comments and content if login
//call this function on the comment route

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
       
    }
    req.session.returnTo = req.originalUrl; 

    res.redirect("/login");
}

module.exports = router;
