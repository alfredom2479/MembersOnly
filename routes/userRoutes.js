const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");

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

router.get("/register", userController.getRegisterUser);

router.post("/register",userController.postRegisterUser);
/*router.post("/register", (req,res,next) =>{
  
  console.log(req.body);
  res.send("register user");
});
*/
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

module.exports = router;