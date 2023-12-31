const express = require("express");
const dotenv = require("dotenv").config();
const debug = require("debug")("test");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

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

const app = express();

//safety first!
//normally just use app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});

app.use(limiter);

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

// add compresssion for more faster responses
// AKA: X-Games mode
app.use(compression());

//Research what this is for bc u forgot u big dummie
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/messages", messageRoutes);
app.use("/", indexRoutes);

app.use(passport.initialize());
app.use(errorHandler);

debug("App is ready to go");

app.listen(port, () => debug(`Server started on port ${port}`));
