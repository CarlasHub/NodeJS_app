var mongoose     = require('mongoose');


// SCHEMA SETUP
//defining a padron for our data not a table...
var beachSchema = new mongoose.Schema({
    name: String, 
    image: String,
    description: String,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

//compile it to a model

module.exports = mongoose.model('Beach', beachSchema);
