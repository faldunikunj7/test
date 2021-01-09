const express=require('express');
const app=express();
const bodyParser=require('body-parser'); 
const errorHandler=require('../../middleware/error-handler');
require('dotenv').config();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// api routes 
app.use('/users',require('../../controller/users.controller'));


// global error handler
app.use(errorHandler);

module.exports=app;