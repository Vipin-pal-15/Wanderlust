const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware/middleware.js");
//controller
const userController=require("../controllers/user.js");

//signup
router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signUp));

//login
router.route("/login")
.get(userController.renderSignin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login,',failureFlash:true}),(userController.signIn));

//logout
router.get("/logout",userController.logOut);

module.exports = router;