const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.postReview=async(req,res)=>{
const listing=await Listing.findById(req.params.id);
const newReview= new Review(req.body.review);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
req.flash("success","New Review Created Successfully!");
res.redirect(`/listings/${listing._id}`);
}