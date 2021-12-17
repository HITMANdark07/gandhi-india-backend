const Seller = require('../models/seller');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
const nodemailer = require('nodemailer');
const SellerRequest = require('../models/sellerRequest');

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

exports.list = (req,res) => {
    Seller.find()
    .exec((err, sellers) =>{
        if(err || !sellers){
            return res.status(400).json({
                error:"Sellers Not fetched"
            })
        }
        return res.json(sellers);
    })
}

exports.signout = (req,res) => {
    res.clearCookie('t')
    res.json({message: 'Signout Success'});
};

exports.requireSigninSeller = expressJwt({
    secret: process.env.JWT_SECRET_SELLER,
    algorithms: ['HS256'] ,
    userProperty:"auth"
});

exports.isSeller = (req, res, next) => {
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

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PWD
    }
  });

exports.sendSellerEmail = (req, res) => {
    const {name, email, phone, id} = req.body;
    const token = jwt.sign({name, email, phone,id}, process.env.JWT_SELLER_ACTIVATION, {expiresIn: '10m'});
    var mailOptions = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: 'KYC Completed, Now Activate your Account',
        text: 'That was really easy!',
        html:`
        <h1>please use the following link to acttivate your account</h1>
        <a href="${process.env.CLIENT_SELLER_URL}/activate/${token}" target="_blank" >CLICK HERE TO ACTIVATE YOUR ACCOUNT</a>
        <hr/>
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_SELLER_URL}</p>
        `
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({
              error: 'Unable to send Email. please try after some time'
          })
        } else {
          res.json({
              message: `Email has been sent to ${email} for activation.`
          })
        }
      });
}

