// if(process.env.NODE_ENV != "production"){
// require('dotenv').config();
// };
require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const ExpressError=require('./util/ExpressError.js')
const session=require("express-session");
const MongoStore = require('connect-mongo').default;

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((error) => {
    console.log(error);
  });

async function main() {
  await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//mongostore
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET_KEY,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERRPR in MONGO SESSION STORE",err);
})


//express-session
const sessionOptions={
  store,
  secret:process.env.SECRET_KEY,
  resave:false,
  saveUnintialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 1000,
    httpOny:true,
  }
};

// app.get("/", (req, res) => {
//   res.send("Hi i am Vipin");
// });

app.use(session(sessionOptions));
//flash
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

// app.get("/demouser",async (req,res)=>{
//   let fakeuser=new User({
//     email:"student@gmail.com",
//     username:"students"
//   });
//   const registeruser=await User.register(fakeuser,"helloworld");
//   res.send(registeruser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter)

//middleware
app.use((err,req,res,next)=>{ 
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{ message,err});
    // res.status(statusCode).send(message);
});

app.listen(8000, () => {
  console.log("server is running on 8000");
});
