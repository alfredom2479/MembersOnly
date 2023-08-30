const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/",(req,res,next)=>{
  //res.redirect("/register");
  res.send("if logged in, send to allmessages. else, to register");
});



//REGISTER 

router.get("/register", (req,res,next)=>{
  if(req.isAuthenticated()){
    //res.send("already logged in. Log Out to register new account");
    res.redirect("/user/logout")
  }
  else{
  userController.getRegisterUser(req,res,next);
  }
});

router.post("/register",userController.postRegisterUser);

//LOGIN

router.get("/login", (req,res,next)=>{
  if(req.isAuthenticated()){
    //res.send("already logged in. Log Out to log into another account");
    res.redirect("/user/logout");
  }
  else{
  userController.getLoginUser(req,res,next);
  }
});

router.post("/login", userController.postLoginUser);

//LOGOUT

router.get("/logout", (req,res,next)=>{
  if(!req.isAuthenticated()){
    //res.send("You are not logged in.")
    res.redirect("/user/login");
  }
  else{
    userController.getLogoutUser(req,res,next);
  }
});

router.post("/logout", userController.postLogoutUser);

//JOIN PRIVATE CLUB

router.get("/join", (req,res,next)=>{
  if(!req.isAuthenticated()){
    //res.send("You must be logged in to join the club");
    res.redirect('/user/login');
  }
  else if(req.user.is_member){
    res.redirect('/');
  }
  else{
  userController.getJoinUser(req,res,next);
  }
});

router.post("/join", userController.postJoinUser);

//BECOME AN ADMIN

router.get("/admin",(req,res,next)=>{
  if(!req.isAuthenticated()){
    res.redirect("/user/login");
  }
  else if(req.user.is_admin){
    res.redirect('/');
  }
  else{
    userController.getBecomeAdmin(req,res,next);
  }
});

router.post("/admin", userController.postBecomeAdmin);

module.exports = router;
