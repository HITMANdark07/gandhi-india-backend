const Agent = require('../models/agent');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signUp = (req,res) => {

    const agent = new Agent(req.body);
        agent.save(async(error, agent)=>{
        if (error) {
           return res.status(400).json({
               error:errorHandler(error)
           });
        }
        const token = jwt.sign({_id: agent._id}, process.env.JWT_SECRET_AGENT);
        res.cookie('t', token, {expire: new Date() + 9999})
        agent.salt= undefined;
        agent.hashed_password = undefined;
        const {_id, name,email,phone} = agent;
        await res.json({
            agent:{_id, name,email,phone},
             token
       });
    });
};

exports.signin = (req, res) =>{
    //find agent based on email
    const {email, password}= req.body;
    Agent.findOne({email},(err, agent)=>{
       if(err || !agent) {
           return res.status(400).json({
               err:"Agent with that email does not exist. Apply for KYC Verification"
           });
       }
       // if agent is found make sure the email and password match
       // create authenticate method in agent model
       if (!agent.authenticate(password)){
           return res.status(401).json({
               err: "Incorrect password"
           })
       }

       //generate a signed token with agent id and secret
       const token = jwt.sign({_id: agent._id}, process.env.JWT_SECRET_AGENT)
       //persist the token as 't' in cookie with expiry date
       res.cookie('t', token, {expire: new Date() + 9999})
       //return response with agent and token to frontend client 
       const {_id, name, email,phone} = agent;
       return res.json({
           token,
           agent:{ _id, name, email,phone}
       });
    });
};

exports.signout = (req,res) => {
    res.clearCookie('t')
    res.json({message: 'Signout Success'});
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET_AGENT,
    algorithms: ['HS256'] ,
    userProperty:"auth"
});

exports.isAgent = (req, res, next) => {
    console.log(req.profile._id === req.auth._id);
    let agent = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!agent){
       return res.status(403).json({ 
           error: 'Access denied'
       });
    }
    next();
};

exports.agentById = (req, res, next, id) => {
    Agent.findById(id).exec((err, agent)=>{
       if(err || !agent) {
         return res.status(400).json({
            error: 'Agent not found'
        });
     }
        req.profile= agent;
        next();
    });
};

