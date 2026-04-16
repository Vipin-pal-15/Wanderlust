const express = require('express');
const router=express.Router({mergeParams:true});
// const ExpressError = require("../util/ExpressError.js");
const  wrapAsync = require('../util/wrapAsync.js');
const {validateReview,isLoggedin}=require("../middleware/middleware.js");
const reviewController=require("../controllers/reviews.js");

//Reviews
//Post Route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.postReview));

module.exports=router;