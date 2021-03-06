//jshint esversion:6
require('dotenv').config()
const express =require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const app = express();


app.use(express.static("public"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded(
  {
    extended: true
  }
))

//connect to database
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true,useUnifiedTopology: true })

// const userScema = {
//   email: String,
//   password:String
// };

//create mongoose user schema

const userSchema = new mongoose.Schema(
  {
      email: String,
      password:String
  }
);



userSchema.plugin(encrypt,{secret: process.env.SECRET, excludeFromEncryption: ["email"]})

const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});


app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/register",(req,res)=>{
  res.render("register");
});

app.get("/submit",(req,res)=>{
  res.render("submit")
})
app.post("/register",(req,res)=>{
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      res.send(err)
    }else{
      res.render("secrets")
    }
  })
});

app.post("/login",(req,res)=>{
const username = req.body.username
const password = req.body.password

User.findOne({email:username},function(err,foundUser){
  if(err){
    console.log(err)
  }else{
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
        console.log(foundUser.password)
      }else{
        res.send("invalid credetials")
      }
    }
  }
})
})
app.listen(3000,function(req,res){
console.log("server started on port 3000");
});
