const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const SellerRequest = require('../models/sellerRequest');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.sellerRequestById = (req, res, next, id) => {
    SellerRequest.findById(id)
    .exec((err, sellerRequest)=>{
        if(err || !sellerRequest) {
            return res.status(400).json({
                error:"sellerRequest not found"
            });
        } 
        req.sellerRequest = sellerRequest;
        next();
    });
};

exports.list = (req, res) => {
    SellerRequest.find()
    .select("-photo -pan -id_proof -signature")
    .exec((err,sellerRequest) => {
        if(err || !sellerRequest){
            return res.status(400).json({
                error:"Unable to Fetch KYC Requests"
            });
        }
        return res.json(sellerRequest);
    })
}

exports.read = (req, res)=>{
    req.sellerRequest.photo = undefined;
    req.sellerRequest.pan = undefined;
    req.sellerRequest.id_proof = undefined;
    req.sellerRequest.signature = undefined;
    return res.json(req.sellerRequest);
};


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
        console.log(name, email, phone);

         if(!name || !email || !phone){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }
         if(phone.length!=10){
            return res.status(400).json({
                error: 'Phone number Should contain 10 digits...'
            });
         }


        let sellerRequest = new SellerRequest(fields);

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
                sellerRequest.photo.data = fs.readFileSync(files.photo.filepath);
                sellerRequest.photo.contentType = files.photo.mimetype;
                sellerRequest.pan.data = fs.readFileSync(files.pan.filepath);
                sellerRequest.pan.contentType = files.pan.mimetype;
                sellerRequest.id_proof.data = fs.readFileSync(files.id_proof.filepath);
                sellerRequest.id_proof.contentType = files.id_proof.mimetype;
                sellerRequest.signature.data = fs.readFileSync(files.signature.filepath);
                sellerRequest.signature.contentType = files.signature.mimetype;
            }else{
                return res.status(400).json({
                    error: 'All File path should be correct'
                });
            }
            sellerRequest.save((err, result)=>{
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
    let sellerRequest = req.sellerRequest;
    sellerRequest.remove((err, deletedImage)=>{
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
    if(req.sellerRequest.photo.data){
        res.set('Content-Type', req.sellerRequest.photo.contentType);
        return res.send(req.sellerRequest.photo.data);
    }
    next();
};

exports.pan = (req, res, next) => {
    if(req.sellerRequest.pan.data){
        res.set('Content-Type', req.sellerRequest.pan.contentType);
        return res.send(req.sellerRequest.pan.data);
    }
    next();
}

exports.id_proof = (req, res,next) => {
    if(req.sellerRequest.id_proof.data){
        res.set('Content-Type', req.sellerRequest.id_proof.contentType);
        return res.send(req.sellerRequest.id_proof.data);
    }
    next();
}

exports.signature = (req, res,next) => {
    if(req.sellerRequest.signature.data){
        res.set('Content-Type', req.sellerRequest.signature.contentType);
        return res.send(req.sellerRequest.signature.data);
    }
    next();
}

