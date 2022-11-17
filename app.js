//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { Db } = require("mongodb");
const app = express();
const encrypt=require("mongoose-encryption");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});



const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    let username=req.body.username;
    let password=req.body.password;
    
    User.findOne({email: username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    res.send("invalid credentials");
                }
            }
        }
    });
    
});



app.get("/register",function(req,res){
    res.render("register");
    
});

app.post("/register",function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
    
   newUser.save(function(err){
        if (!err){
            res.redirect("/login");
           
        }else{
            res.send(err);
        }
      });
});


app.get("/secrets",function(req,res){
    res.render("secrets");
});

app.get("/submit",function(req,res){
    res.render("submit");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
