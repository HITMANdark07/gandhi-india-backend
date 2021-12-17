const User = require('../models/user');
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user)=>{
       if(err || !user) {
         return res.status(400).json({
            error: 'User not found'
        });
     }
        req.profile= user;
        next();
    });
};

exports.read =(req, res) => {
    req.user.hashed_password=undefined;
    req.user.salt=undefined;
    res.json(req.user);
}

exports.signUp = (req,res) => {

    const user = new User(req.body);
        user.save(async(error, user)=>{
        if (error) {
           return res.status(400).json({
               error:errorHandler(error)
           });
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_USER);
        res.cookie('t', token, {expire: new Date() + 9999})
        user.salt= undefined;
        user.hashed_password = undefined;
        const {_id, name,email} = user;
        await res.json({
            user:{_id, name,email},
             token
       });
    });
};



exports.signin = (req, res) =>{
    //find user based on email
    const {email, password}= req.body;
    User.findOne({email},(err, user)=>{
       if(err || !user) {
           return res.status(400).json({
               err:"user with that email does not exist. please register first"
           });
       }
       // if user is found make sure the email and password match
       // create authenticate method in user model
       if (!user.authenticate(password)){
           return res.status(401).json({
               err: "Incorrect password"
           })
       }

       //generate a signed token with user id and secret
       const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_USER)
       //persist the token as 't' in cookie with expiry date
       res.cookie('t', token, {expire: new Date() + 9999})
       //return response with user and token to frontend client 
       const {_id, name, email} = user;
       return res.json({
           token,
           user:{ _id, name, email}
       });
    });
};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PWD
    }
  });

exports.sendUserEmail = (req, res) => {
    const {name, email, password} = req.body;
    const token = jwt.sign({name, email, password}, process.env.JWT_USER_ACTIVATION, {expiresIn: '300s'});
    var mailOptions = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: 'create your Account',
        text: 'That was really easy!',
        html:`
        <h1>please use the following link to verify your account</h1>
        <a href="${process.env.CLIENT_URL}/activate/${token}" target="_blank" >CLICK HERE TO ACTIVATE YOUR ACCOUNT</a>
        <hr/>
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
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

// exports.referal = (req, res) => {
//     User.find({referal:req.profile._id})
//     .populate('plan', "_id name")
//     .exec((error, users) =>{
//         if(error|| !users){
//             res.status(400).json({
//                 error: 'No user Found'
//             });
//         }
//         return res.json(users);
//     })
// };

// exports.deleteUser = (req, res) => {
//     User.findOneAndDelete(
//         {
//             _id: req.profile._id
//         }, (err, user) => {
//             if(err) {
//                 return res.status(400).json({
//                     error: 'You are not authorised to perform this actions'
//                 });
//             }
//             user.hashed_password = undefined;
//             user.salt = undefined;
//             res.json(user);
//         }
//     );
// }


exports.list = (req, res) => {
    User.find()
    .select("-hashed_password")
    .exec((error, users) => {
        if(error || !users) {
            return res.status(400).json({
                error:'No users found'
            });
        }
        res.json(users);
    });
};

exports.read = (req, res) => {
     req.profile.hashed_password = undefined;
     req.profile.salt = undefined;
     return res.json(req.profile);
};

// exports.update = (req, res) => {
//     User.findOneAndUpdate(
//         { _id: req.profile._id }, 
//         { $set: req.body }, 
//         { new:true },
//         (error, user) => {
//             if(error) {
//                 return res.status(400).json({
//                     error: 'You are not authorised to perform this actions'
//                 });
//             }
//             user.hashed_password = undefined;
//             user.salt = undefined;
//             res.json(user);
//         }
//         );
    
// };

// exports.addOrderToUserHistory = (req, res, next) => {
//     let history= [];

//     req.body.order.plan.forEach(item => {
//         history.push({
//             _id: item._id,
//             name: item.name,
//             description: item.description,
//             transaction_id:req.body.order.transaction_id,
//             amount:req.body.order.amount
//         })
//     })

//     User.findOneAndUpdate(
//             {_id: req.profile._id}, 
//             {$push: {history:history}}, 
//             {new: true},
//             (error, data) => {
//                 if(error) {
//                     return res.status(400).json({
//                         error:"Could not update user purchase history"
//                     });
//                 }
//                 next();
//             }
//         );
// };

// exports.purchaseHistory =(req, res) => {
//     Order.find({user: req.profile._id})
//     .populate('user', '_id name')
//     .sort('-created')
//     .exec((err, orders) => {
//         if(err) {
//             return res.status(400).json({
//                 error: errorHandler(err)
//             });
//         }
//         res.json(orders);
//     });
// };