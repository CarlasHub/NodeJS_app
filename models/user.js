var mongoose     = require('mongoose');
//require the package 
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
//add the plugin to the user
//this will start to add some methods to our user 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);