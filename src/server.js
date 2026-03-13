//server module
const express = require('express');
const app = express();
//
require("dotenv").config()
//token 77 hased password
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//path module
const path = require('path');
//PORT
const PORT = 2000;
//JSON (PARSE<->STRINGFY)
app.use(express.json());
//DATABASE
const pool = require('./database/database');

// users routes
const usersRoutes = require('./routes/tasks');
app.use(usersRoutes);

//reminder route 
const remindRoutes = require('./routes/remind');
app.use(remindRoutes);

//progress
const progressRoutes = require('./routes/progress');
app.use(progressRoutes);

//log page
const logRoutes = require('./routes/log');
app.use(logRoutes);

//dashboard page 
const dashRoutes = require('./routes/dashboard');
app.use(dashRoutes);

const profileRoutes = require('./routes/profile');
app.use(profileRoutes);

//log
app.get('/login.html',(req,res)=>{
    dir = path.join(__dirname,'files','html','login.html');
    res.sendFile(dir);
})
app.get('/register.html',(req,res)=>{
    dir = path.join(__dirname,'files','html','register.html');
    res.sendFile(dir);
})
app.get('/auth.css',(req,res)=>{
    dir = path.join(__dirname,'files','css','auth.css');
    res.sendFile(dir);
})
app.get('/auth.js',(req,res)=>{
    dir = path.join(__dirname,'files','js','auth.js');
    res.sendFile(dir);
})
// home page
app.get(['/','/task.html'],(req,res)=>{
    dir = path.join(__dirname,'files','index.html');
    res.sendFile(dir);
})
app.get('/styles.css',(req,res)=>{
    dir = path.join(__dirname,'files','styles.css');
    res.sendFile(dir);
})
app.get('/script.js',(req,res)=>{
    dir = path.join(__dirname,'files','script.js');
    res.sendFile(dir);
})

//dashboard
app.get('/dashboard.html',(req,res)=>{
    dir = path.join(__dirname,'files','html','dashboard.html');
    res.sendFile(dir);
})
app.get('/dashboard.css',(req,res)=>{
    dir = path.join(__dirname,'files','css','dashboard.css');
    res.sendFile(dir);
})
app.get('/dashboard.js',(req,res)=>{
    dir = path.join(__dirname,'files','js','dashboard.js');
    res.sendFile(dir);
})


//profile page
app.get('/profile.html',(req,res)=>{
    dir = path.join(__dirname,'files','html','profile.html');
    res.sendFile(dir);
})
app.get('/profile.css',(req,res)=>{
    dir = path.join(__dirname,'files','css','profile.css');
    res.sendFile(dir);
})
app.get('/profile.js',(req,res)=>{
    dir = path.join(__dirname,'files','js','profile.js');
    res.sendFile(dir);
})



//SERVER STARTS
app.listen(PORT,()=>{
    console.log(`Server Running on Port : ${PORT}`);
})