const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { passwordStrength } = require('check-password-strength')
const UserData = require('./Schema/user');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')


app.set('view engine','views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/UserDetails')
.then((d)=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log(err);
})
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'soyebsarkar200@gmail.com',
      pass: 'jlryiaqpzhqzpaks'
    }
  });

  
let OTP = null;
let userInfo = null;
//Home
app.get('/',(req,res)=>{
    res.render('home');
})
//OTP form
app.get('/verify',(req,res)=>{
    res.render('verify');
})
// For verifying OTP
app.post('/verify', async(req,res)=>{
    const {code} = req.body;
    console.log(OTP,code);
    if(code===OTP){
        const data = new UserData(userInfo);
        id = data._id.valueOf();
        await data.save();
        console.log(id);
        const mailOptions = {
            from: 'soyebsarkar200@gmail.com',
            to: data.email,
            subject: 'Account Created',
            text: `Congratulation Your Account is successfuly Created. Your Id is: ${id}`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.redirect("/login");

    }
    else{
        res.send('Wrong OTP');
    }
    
})
//Creating New Account
app.post('/create',async (req,res)=>{
    const {userName,email,password} = req.body;
    const strength = passwordStrength(password).value;
    OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    console.log(OTP);
    if(strength === "Strong"){
        userInfo = {
            username:userName,
            email:email,
            password:password
        };
        
        
        // res.redirect('/verify');
        // res.end;
    }
    if(userInfo==null){
        res.send("NOT Strong");
    } else {
        const mailOptions = {
            from: 'soyebsarkar200@gmail.com',
            to: email,
            subject: 'Verify Your Account',
            text: `Your OTP is ${OTP}`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          res.redirect('/verify');
    }
    
})

// Login Form
app.get('/login',(req,res)=>{
    res.render("login");
})
// Verify Login
app.post('/login',async (req,res)=>{
    let {email,password} = req.body;
    const userD = await UserData.find({});
    password = password.trim();
    for(let user of userD){
        console.log(user.password);
        if(user.email === email && user.password==password){
            // console.log(user);
            res.send("Matched");
        }
    }

    res.send("Not Matched");
    
})

app.listen(3000,(err)=>{
    console.log("Server is running")
})