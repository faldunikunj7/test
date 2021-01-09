const express=require('express');
const app=express();
const bodyParser=require('body-parser');
// const jwt=require('../../middleware/jwt');
const errorHandler=require('../../middleware/error-handler');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// // use JWT auth to secure the api
// app.use(jwt());

// api routes 
app.use('/users',require('../../controller/users.controller'));


// global error handler
app.use(errorHandler);

module.exports=app;