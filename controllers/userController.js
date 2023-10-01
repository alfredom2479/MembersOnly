const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


//REGISTER

exports.getRegisterUser = (req,res,next)=>{
  res.render("register_form",{
    title: "Register!"
  })
};

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

    bcrypt.hash(req.body.password,10, async (err,hashedPassword)=>{
      if(err){
        return next(err)
      }
      try{
        const newUser = new User({
          first_name:req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          is_member: false,
          is_admin: false
        });
        if(!validationErrors.isEmpty()){
          res.render("register_form",{
            title: "Sign Up!",
            user: newUser,
            errors: validationErrors.array()
          });
        }
        else{
          const savedUser = await newUser.save();
          res.redirect('/user/login')
        }
      }catch(err2){
        return next(err2);
      }
    })
  })
];

//LOGIN

exports.getLoginUser = (req,res,next)=>{
  res.render("login_form",{
    title: "Log In!"
  });
};

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
  },
  async (username,password,done)=>{
    try {
      const targetUser = await User.findOne({username});

      if(!targetUser){
        return done(null,false,{message: "Incorrect username"});
      }
      const isPasswordMatch = await bcrypt.compare(password, targetUser.password);

      if(!isPasswordMatch){
        return done(null,false,{message: "Incorrect password"});
      }

      return done(null, targetUser);
    }catch(err){
      return done(err);
    }
  }
));

passport.serializeUser((user,done)=>{
  done(null,user.id)
});

passport.deserializeUser(async (id,done)=>{
  try{
    const user = await User.findById(id);
    done(null,user);
  }catch(err){
    done(err);
  }
})

exports.postLoginUser = passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/user/login'
})

// LOGOUT

exports.getLogoutUser = (req,res,next)=>{
  res.render("logout_form");
}

exports.postLogoutUser = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    res.redirect("/")
  })
}

//JOIN

exports.getJoinUser = (req,res,next)=>{
  res.render("join_form",{
    username: res.locals.currentUser.username
  })
};

exports.postJoinUser = asyncHandler(async (req,res,next)=>{
  if(req.body.passcode != "give me the formuoli"){
    res.render("join_form",{
      title: "Join The Club!",
      username: res.locals.currentUser.username,
      error: 'Wrong Passcode! I guess ur not k00l enough. sorry.'
    })
  }
  else{
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {is_member:true}, 
    );
    res.redirect("/");
  }
})

//BECOME ADMIN 

exports.getBecomeAdmin = (req,res,next)=>{
  res.render("admin_form",{
    username: res.locals.currentUser.username
  });
};

exports.postBecomeAdmin = asyncHandler(async (req,res,next)=>{
  if(req.body.passcode != "pretty please"){
    res.render("admin_form",{
      username: res.locals.currentUser.username,
      error: "Wrong Passcode. No admin powers 4 u"
    });
  }
  else{
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {is_admin: true}
    );
    res.redirect("/");
  }
})