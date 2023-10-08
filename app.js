const express = require("express");
const dotenv = require("dotenv").config();
const debug = require("debug")("test");

const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 6000;
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const passport = require("passport");
const session = require("express-session");

const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

connectDB();
debug("MONGODB is set");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));

//authenticaion

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//req header parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/messages", messageRoutes);
app.use("/", indexRoutes);
//app.use('*',(req,res)=> res.redirect('/messaages'));

app.use(passport.initialize());
app.use(errorHandler);

debug("App is ready to go");

app.listen(port, () => debug(`Server started on port ${port}`));
