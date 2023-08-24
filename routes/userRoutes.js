const express = require('express');
const router = express.Router();

router.get("/",(req,res,next)=>{
  //res.redirect("/register");
  res.send("if logged in, send to logout. else, to login");
});

//LOGIN

router.get("/login",(req,res,next)=>{
  res.send(" get login form");
});

router.post("/login",(req,res,next)=>{
  res.send("login user");
});

//REGISTER 

router.get("/register", (req,res,next)=>{
  res.send("get register form");
});

router.post("/register", (req,res,next) =>{
  res.send("register user");
});

//LOGOUT

router.get("/logout",(req,res,next)=>{
  res.send("get logout confirmation form");
});

router.post("logout",(req,res,next)=>{
  res.send("logout user");
});

//JOIN PRIVATE CLUB

router.get("/join", (req,res,next)=>{
  res.send("get join club form");
});

router.post("/join", (req,res,next)=>{
  res.send("join club if code is right");
});