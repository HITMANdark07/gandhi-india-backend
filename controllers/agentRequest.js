const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const AgentRequest = require('../models/agentRequest');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.agentRequestById = (req, res, next, id) => {
    AgentRequest.findById(id)
    .exec((err, agentRequest)=>{
        if(err || !agentRequest) {
            return res.status(400).json({
                error:"agent Request not found"
            });
        } 
        req.agentRequest = agentRequest;
        next();
    });
};

exports.read = (req, res)=>{
    req.agentRequest.photo = undefined;
    req.agentRequest.pan = undefined;
    req.agentRequest.id_proof = undefined;
    req.agentRequest.signature = undefined;
    return res.json(req.agentRequest);
};

exports.list = (req, res) => {
    AgentRequest.find()
    .select("-photo -pan -id_proof -signature")
    .exec((err,agentRequests) => {
        if(err || !agentRequests){
            return res.status(400).json({
                error:"Unable to Fetch KYC Requests"
            });
        }
        return res.json(agentRequests);
    })
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Something Went Wrong'
            });
        }
        const { name, email, phone } = fields;

         if(!name && !email && !phone){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }


        let agentRequest = new AgentRequest(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo && files.pan && files.id_proof && files.signature){
            // console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000 && files.pan.size > 1000000 && files.id_proof.size > 1000000 && files.signature.size > 1000000){
                return res.status(400).json({
                    error: 'File Size should less than 1mb'
                });
            }
            if(files.photo.filepath && files.pan.filepath && files.id_proof.filepath && files.signature.filepath){
                agentRequest.photo.data = fs.readFileSync(files.photo.filepath);
                agentRequest.photo.contentType = files.photo.mimetype;
                agentRequest.pan.data = fs.readFileSync(files.pan.filepath);
                agentRequest.pan.contentType = files.pan.mimetype;
                agentRequest.id_proof.data = fs.readFileSync(files.id_proof.filepath);
                agentRequest.id_proof.contentType = files.id_proof.mimetype;
                agentRequest.signature.data = fs.readFileSync(files.signature.filepath);
                agentRequest.signature.contentType = files.signature.mimetype;
            }else{
                return res.status(400).json({
                    error: 'All File path should be correct'
                });
            }
            agentRequest.save((err, result)=>{
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({
                    message: "Requested for KYC Approval..."
                });
            });
        }else{
            return res.status(400).json({
                error: 'All detailed fields are required'
            });
        }   
    });
};

exports.remove = (req,res) => {
    let agentRequest = req.agentRequest;
    agentRequest.remove((err, deletedImage)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Seller KYC Request deleted Successfully'
        });
    });
};

exports.photo = (req, res, next) => {
    if(req.agentRequest.photo.data){
        res.set('Content-Type', req.agentRequest.photo.contentType);
        return res.send(req.agentRequest.photo.data);
    }
    next();
};

exports.pan = (req, res, next) => {
    if(req.agentRequest.pan.data){
        res.set('Content-Type', req.agentRequest.pan.contentType);
        return res.send(req.agentRequest.pan.data);
    }
    next();
}

exports.id_proof = (req, res,next) => {
    if(req.agentRequest.id_proof.data){
        res.set('Content-Type', req.agentRequest.id_proof.contentType);
        return res.send(req.agentRequest.id_proof.data);
    }
    next();
}

exports.signature = (req, res,next) => {
    if(req.agentRequest.signature.data){
        res.set('Content-Type', req.agentRequest.signature.contentType);
        return res.send(req.agentRequest.signature.data);
    }
    next();
}

