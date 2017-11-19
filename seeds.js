var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
var data = [
    {
     name: "Cloud's Rest",
     image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg",
     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin nibh nisl condimentum id. Tristique magna sit amet purus gravida quis blandit turpis cursus. Amet cursus sit amet dictum sit amet justo donec enim. Cras tincidunt lobortis feugiat vivamus at augue eget. Maecenas ultricies mi eget mauris pharetra et ultrices neque ornare. Elementum integer enim neque volutpat ac tincidunt vitae. Justo eget magna fermentum iaculis eu. Duis at tellus at urna condimentum mattis pellentesque id nibh. Interdum posuere lorem ipsum dolor sit amet. Ac auctor augue mauris augue neque gravida."
    },
    {
     name: "Desert Mesa",
     image: "https://farm7.staticflickr.com/6089/6094103869_d53a990c83.jpg",
     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin nibh nisl condimentum id. Tristique magna sit amet purus gravida quis blandit turpis cursus. Amet cursus sit amet dictum sit amet justo donec enim. Cras tincidunt lobortis feugiat vivamus at augue eget. Maecenas ultricies mi eget mauris pharetra et ultrices neque ornare. Elementum integer enim neque volutpat ac tincidunt vitae. Justo eget magna fermentum iaculis eu. Duis at tellus at urna condimentum mattis pellentesque id nibh. Interdum posuere lorem ipsum dolor sit amet. Ac auctor augue mauris augue neque gravida."
    },
    {
     name: "Canyon Floor",
     image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin nibh nisl condimentum id. Tristique magna sit amet purus gravida quis blandit turpis cursus. Amet cursus sit amet dictum sit amet justo donec enim. Cras tincidunt lobortis feugiat vivamus at augue eget. Maecenas ultricies mi eget mauris pharetra et ultrices neque ornare. Elementum integer enim neque volutpat ac tincidunt vitae. Justo eget magna fermentum iaculis eu. Duis at tellus at urna condimentum mattis pellentesque id nibh. Interdum posuere lorem ipsum dolor sit amet. Ac auctor augue mauris augue neque gravida."
    },
]
    
function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
       if(err) {
           console.log(err);
       } else {
           console.log("removed campgrounds!");
           data.forEach(function(seed){
           //add a few campgrounds
           Campground.create(seed, function(err, campground){
           if(err){
               console.log(err);
           } else {
               console.log("added A campground");
               //add a few comments
               Comment.create(
                   {
                       text: "This place is great",
                       author: "Homer"
                   }, function(err, comment){
                       if(err){
                           console.log(err)
                       } else {
                           campground.comments.push(comment);
                           campground.save();
                           console.log("created new comment");
                       }
                   });
           }
       });
   });
       
   }
});
}
module.exports = seedDB;