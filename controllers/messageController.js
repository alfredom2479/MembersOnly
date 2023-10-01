const Message = require("../models/MessageModel");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");


exports.getCreateMessage = (req,res,next)=>{
  res.render("message_form",{
    username: req.user.username
  });
};

exports.postCreateMessage = [
  body("message")
    .exists().withMessage("Message field is missing")
    .trim().notEmpty().withMessage("Message cannot be empty")
    .isLength({max: 400}).withMessage("Message cannot be larger than 400 characters")
    .escape(),
  
  asyncHandler (async (req,res,next)=>{
    const validationErrors = validationResult(req);

    if(!req.isAuthenticated()){
      res.send("Must be logged in to send a message");
    }

    const newMessage = new Message({
      author: req.user._id,
      content: req.body.message
    });

    if(!validationErrors.isEmpty()){
      res.render("message_form",{
        username: req.user.username,
        errors: validationErrors.array()
      });
    }
    else{
      const savedMessage = await newMessage.save();
      res.redirect('/');
    }
  })
];

exports.getAllMessages = asyncHandler( async(req,res,next) =>{
  
  allMessages = await Message.find().populate("author");

  res.render("message_list",{
    user: req.user,
    message_list : allMessages
  });
});

exports.getDeleteMessage = asyncHandler(async (req,res,next)=>{
  const targetMessage = await Message.findById(req.params.id).populate('author');

  if (targetMessage === null){
    res.send("Message Not Found");
  }

  res.render("message_delete",{
    message: targetMessage
  });
});

exports.postDeleteMessage = asyncHandler(async (req,res,next)=>{

  deletedMessage = await Message.findByIdAndRemove(req.body.messageid);
  res.redirect("/messages");
})