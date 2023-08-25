const express = require('express');
const dotenv = require('dotenv').config();
const errorHandler = require('./middleware/errorMiddleware');
const connectDB =require('./config/db');
const port = process.env.PORT || 5000;
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

connectDB();

const app = express();

app.set('views', path.join(__dirname,'views'))
app.set('view engine','pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')));


app.use("/user",userRoutes);
app.use("messages",messageRoutes);
app.use("/", indexRoutes);
app.use('*',(req,res)=> res.redirect('/messaages'));


app.use(errorHandler);

app.listen(port,()=> console.log(`Server started on port ${port}`));