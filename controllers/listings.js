const Listing = require("../models/listing");

//index
module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

//new
module.exports.newaddForm=async(req, res) => {
  res.render("listings/new");
};

//show
module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if(!listing){
        req.flash("error","Listing you requisted does not exist!");
       return res.redirect("/listings");
  }
  console.log(listing)
  res.render("listings/show", { listing });
};

//create
module.exports.createListing=async (req, res, next) => {
  //file upload
  let url=req.file.path;
  let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings");
};

//edit
module.exports.editListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
      req.flash("error","Listing does't exist");
      req.redirect("/listings");
  }
  let originalImg=listing.image.url;
  originalImg=originalImg.replace("/upload","/upload/w_250/e_blur:100");
  res.render("listings/edit", { listing,originalImg });
};

//update
module.exports.updateListing=async (req, res) => {
  let { id } = req.params;
  const listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== 'undefined'){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}

//delete
module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted Successfully!");
  res.redirect("/listings");
}