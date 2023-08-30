const express = require('express');
const router = express.Router();

const messageController = require("../controllers/messageController");

router.get("/",messageController.getAllMessages)

// CREATE NEW MESSAGE

router.get("/newmessage", (req,res,next)=>{
  if(req.isAuthenticated()){
    messageController.getCreateMessage(req,res,next);
  }
  else{
    res.redirect("/user/login");
  }
})

router.post("/newmessage", messageController.postCreateMessage);

//DELETE MESSAGE

router.get("/delete/:id", (req,res,next)=>{
  if(req.isAuthenticated() && req.user.is_admin){
    messageController.getDeleteMessage(req,res,next);
  }
  else{
    res.redirect("/");
  }
})

router.post("/delete/:id",(req,res,next)=>{
  if(req.isAuthenticated() && req.user.is_admin){
    messageController.postDeleteMessage(req,res,next);
  }
  else{
    res.redirect('/');
  }
})

module.exports = router;