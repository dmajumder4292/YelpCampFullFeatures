var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'webdeb', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//The INDEX Route - Shows all Campgrounds
router.get("/", function(req, res){
   if(req.query.search){
       const regex = new RegExp(escapeRegax(req.query.search),'gi');
       Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
               res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
           }
       });
   } else {
       Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
               res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
           }
       });
       }
});

//The CREATE Route - Adds new campground to the DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
/*    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }*/
    geocoder.geocode(req.body.campground.location, function (err, data) {
        cloudinary.uploader.upload(req.file.path, function(result) {
          // add cloudinary url for the image to the campground object under image property
          req.body.campground.image = result.secure_url;
          // add author to campground
          req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
          }
          req.body.campground.lat = data.results[0].geometry.location.lat;
          req.body.campground.lng = data.results[0].geometry.location.lng;
            //var lat = data.results[0].geometry.location.lat;
            //var lng = data.results[0].geometry.location.lng;
          req.body.campground.location = data.results[0].formatted_address;
            //var newCampground = {name: name, image: image, description: description, price: price, author:author, location: location, lat: lat, lng: lng};
          Campground.create(req.body.campground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    });
});
});
//The NEW Route - Shows the form page
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

//The SHOW Route - Shows more information about a particular campground 
router.get("/:id", function(req, res) {
    //find the campaign with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
            req.flash("error", "Campground not found");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});


//UPDATE Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

//DESTROY Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   }) 
});

function escapeRegax(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;