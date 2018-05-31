var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var passport      = require("passport");
var router        = express.Router();
var LocalStrategy = require("passport-local");
var Beach         = require("./models/beach");
var User          = require("./models/user");
var Comment       = require("./models/comment");
var seedDB        = require("./seeds");


//requring routes
var  indexRoutes      = require("./routes/index");
var  beachesRoutes    = require("./routes/beaches");
var  commentRoutes    = require("./routes/comments");



//connect to the database
mongoose.connect("mongodb://localhost/beach_app");

//parse application
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This surely is a nice app",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//the User authenticate comes with the package otherwise you would have to write it from the scratch 
passport.use(new LocalStrategy(User.authenticate()));
//another one that comes for free with passport-local-mongoose 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//anything we pass in will be available in any route 

app.use(function(req, res, next){
    //this is middleware
   res.locals.currentUser = req.user;
   //include next() otherwise will stop
  
   next();
});



app.use("/", indexRoutes);
app.use("/beaches",  beachesRoutes );
app.use("/beaches/:id/comments", commentRoutes);




app.listen(process.env.PORT, process.env.Ip, function(){
    
    console.log('luck you! v1 server is running fine yeay');
});