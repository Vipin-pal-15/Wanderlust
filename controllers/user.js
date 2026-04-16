const User =require("../models/user");

module.exports.renderSignup=async(req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signUp=async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next();
            }
            req.flash("success", "welcome to Wanderluste!");
            res.redirect(res.locals.redirectUrl || "/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderSignin=async(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.signIn=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    const redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out now");
        res.redirect("/listings")
    });
}
