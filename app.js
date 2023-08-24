/*const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB =require('./config/db');
const port = process.env.PORT || 5000;
*/
impoort express from 'express';

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.use(errorHandler);