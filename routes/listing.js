const express = require("express");
const router=express.Router();
const  wrapAsync = require('../util/wrapAsync.js');
const {isLoggedin,isOwner,validateListing} = require("../middleware/middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file)
// });


//New Route
router.get("/new",isLoggedin, listingController.newaddForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedin,isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editListing));

module.exports=router;