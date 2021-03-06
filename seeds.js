var mongoose     = require('mongoose');
var Beach        = require("./models/beach");
var Comment      = require("./models/comment");
var User1        = require("./models/user");
var data         =[
   {
        name: "Tavira", 
        image:"https://www.atlantisbahamas.com/media/Things%20To%20Do/Water%20Park/Beaches/Hero/Experiences_Beach.jpg",
        description :"how lovely and fun - this is the place to be",
        id : "588c2e092403d111454fff76",
        username: "Carla Goncalves"
            
        },
    
    {
        name: "Albufeira", 
        image:"https://www.atlantisbahamas.com/media/Things%20To%20Do/Water%20Park/Beaches/Hero/Experiences_Beach.jpg",
        description :"how lovely and fun - this is the place to be",
        id : "588c2e092403d111454fff76",
        username: "Carla Goncalves "
            
        }
    
    ]
   


function seedDB(){
    //remove all beaches 
        Beach.remove({}, function(err){
            if(err){
                 console.log(err);
                
            }
              console.log('remove beach');
    });
    
    // add a few beaches 
    data.forEach(function(seed){
        Beach.create(seed , function(err, beach){
            if(err){
                console.log(err);
            }else{
                console.log("added a Beach");
                // add a comment 
                   Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Carla"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                beach.comments.push(comment);
                                beach.save();
                                console.log("Created new comment");
                            }
                        });
                }
        });
        
    });
    // add a few comments 

}


module.exports = seedDB;





