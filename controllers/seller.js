const Seller = require('../models/seller');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signUp = (req,res) => {

    const seller = new Seller(req.body);
        seller.save(async(error, seller)=>{
        if (error) {
           return res.status(400).json({
               error:errorHandler(error)
           });
        }
        const token = jwt.sign({_id: seller._id}, process.env.JWT_SECRET_SELLER);
        res.cookie('t', token, {expire: new Date() + 9999})
        seller.salt= undefined;
        seller.hashed_password = undefined;
        const {_id, name,email,phone} = seller;
        await res.json({
            seller:{_id, name,email,phone},
             token
       });
    });
};

exports.signin = (req, res) =>{
    //find seller based on email
    const {email, password}= req.body;
    Seller.findOne({email},(err, seller)=>{
       if(err || !seller) {
           return res.status(400).json({
               err:"seller with that email does not exist. Apply for KYC Verification"
           });
       }
       // if seller is found make sure the email and password match
       // create authenticate method in seller model
       if (!seller.authenticate(password)){
           return res.status(401).json({
               err: "Incorrect password"
           })
       }

       //generate a signed token with seller id and secret
       const token = jwt.sign({_id: seller._id}, process.env.JWT_SECRET_SELLER)
       //persist the token as 't' in cookie with expiry date
       res.cookie('t', token, {expire: new Date() + 9999})
       //return response with seller and token to frontend client 
       const {_id, name, email,phone} = seller;
       return res.json({
           token,
           seller:{ _id, name, email,phone}
       });
    });
};

exports.signout = (req,res) => {
    res.clearCookie('t')
    res.json({message: 'Signout Success'});
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET_SELLER,
    algorithms: ['HS256'] ,
    userProperty:"auth"
});

exports.isSeller = (req, res, next) => {
    console.log(req.profile._id === req.auth._id);
    let seller = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!seller){
       return res.status(403).json({ 
           error: 'Access denied'
       });
    }
    next();
};

exports.sellerById = (req, res, next, id) => {
    Seller.findById(id).exec((err, seller)=>{
       if(err || !seller) {
         return res.status(400).json({
            error: 'Seller not found'
        });
     }
        req.profile= seller;
        next();
    });
};

