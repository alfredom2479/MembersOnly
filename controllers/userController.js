const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

exports.getRegisterUser = asyncHandler( async (req,res,next)=>{
  res.render("register_form",{
    title: "Register!"
  })
});

exports.postRegisterUser = [
  body("first_name")
    .exists().withMessage("First name field is missing")
    .trim().notEmpty().withMessage("First name is required")
    .isLength({min:2,max:50}).withMessage('First Name must be between 2 and 50 characters long')
    .isAlpha().withMessage("First name must only contain alphabetic characters"),
  body("last_name").exists().withMessage("Last name field is missing")
    .trim().notEmpty().withMessage("Last name is required")
    .isLength({min:2,max:50}).withMessage("Last name must be between 2 and 50 characters long")
    .isAlpha().withMessage("Last name must only contain alphabetic characters"),
  body("email")
    .exists().withMessage("Email field is missing")
    .trim().notEmpty().withMessage("Email is required")
    .isLength({min:4,max:320}).withMessage("Email is too short or too long")
    .isEmail().withMessage("Please provide a valid email address"),
  body("username")
    .exists().withMessage("Username field is missing")
    .trim().notEmpty().withMessage("Username is required")
    .isLength({min:3,max:20}).withMessage("Username is too short or too long")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
  body("password")
    .exists().withMessage("Password field is missing")
    .trim().notEmpty().withMessage("Password is required")
    .matches(/\d/).withMessage("Password must contain at least 1 number")
    .matches(/[a-z]/).withMessage("Password must contain at least 1 lowercase letter")
    .matches(/[A-z]/).withMessage("Password must contain at least 1 uppercase letter")
    .matches(/[\W_]/).withMessage("Password must contain at least one special character"),
  body("confirm_password")
    .exists().withMessage("Confirm password field is missing")
    .notEmpty().withMessage('Confirm password is required')
    .custom((value,{req})=>{
      if (value != req.body.password){
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  asyncHandler(async (req,res,next)=>{
    const validationErrors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      is_member: false
    });
    console.log('after dec');

    if (!validationErrors.isEmpty()){
      console.log('fail');
      res.render("register_form",{
        title: "Register!",
        user: user,
        errors: validationErrors.array()
      });
    }
    else{
      console.log("else");
      const savedUser = await user.save();
      console.log(savedUser);
      res.redirect('/user/register');
    }

  })
]