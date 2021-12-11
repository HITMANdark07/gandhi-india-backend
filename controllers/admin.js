const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signUp = (req,res) => {
    const admin_emails = ["admin@admin.com","admin2@admin.com", "admin3@admin.com", "admin4@admin.com"];


    if(!admin_emails.includes(req.body.email)){
        return res.status(400).json({
            error:"Your email is not authorised to register as admin"
        });
    }
    
    const admin = new Admin(req.body);
        admin.save(async(error, admin)=>{
        if (error) {
           return res.status(400).json({
               error:errorHandler(error)
           });
        }
        const token = jwt.sign({_id: admin._id}, process.env.JWT_SECRET_ADMIN);
        res.cookie('t', token, {expire: new Date() + 9999})
        admin.salt= undefined;
        admin.hashed_password = undefined;
        const {_id, name,email} = admin;
        await res.json({
            admin:{_id, name,email},
             token
       });
    });
};

exports.signin = (req, res) =>{
    //find admin based on email
    const {email, password}= req.body;
    Admin.findOne({email},(err, admin)=>{
       if(err || !admin) {
           return res.status(400).json({
               err:"Admin with that email does not exist. please register first"
           });
       }
       // if admin is found make sure the email and password match
       // create authenticate method in admin model
       if (!admin.authenticate(password)){
           return res.status(401).json({
               err: "Incorrect password"
           })
       }

       //generate a signed token with admin id and secret
       const token = jwt.sign({_id: admin._id}, process.env.JWT_SECRET_ADMIN)
       //persist the token as 't' in cookie with expiry date
       res.cookie('t', token, {expire: new Date() + 9999})
       //return response with admin and token to frontend client 
       const {_id, name, email} = admin;
       return res.json({
           token,
           admin:{ _id, name, email}
       });
    });
};

exports.signout = (req,res) => {
    res.clearCookie('t')
    res.json({message: 'Signout Success'});
};

exports.requireSigninAdmin = expressJwt({
    secret: process.env.JWT_SECRET_ADMIN,
    algorithms: ['HS256'] ,
    userProperty:"auth"
});

exports.isAdmin = (req, res, next) => {
    let admin = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!admin){
       return res.status(403).json({ 
           error: 'Access denied'
       });
    }
    next();
};

exports.adminById = (req, res, next, id) => {
    Admin.findById(id).exec((err, admin)=>{
       if(err || !admin) {
         return res.status(400).json({
            error: 'Admin not found'
        });
     }
        req.profile= admin;
        next();
    });
};

