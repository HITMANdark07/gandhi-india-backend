const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Image = require('../models/image');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.ImageById = (req, res, next, id) => {
    Image.findById(id)
    .exec((err, image)=>{
        if(err || !image) {
            return res.status(400).json({
                error:"Image not found"
            });
        } 
        req.image = image;
        next();
    });
};


exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }



        let image = new Image(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            // console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            if(files.photo.filepath){
                image.photo.data = fs.readFileSync(files.photo.filepath);
                image.photo.contentType = files.photo.mimetype;
            }else{
                return res.status(400).json({
                    error: 'Image path is not specified'
                });
            }
            image.save((err, result)=>{
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({
                    message:"Uploaded"
                });
            });
            
        }else{
            return res.status(400).json({
                error: 'Please add image file'
            });
        }

        
    });
};

exports.remove = (req,res) => {
    let image = req.image;
    image.remove((err, deletedImage)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Image deleted Successfully'
        });
    });
};


exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files)=> {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let image = req.image

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            image.photo.data = fs.readFileSync(files.photo.path);
            image.photo.contentType = files.photo.type
        }
        image.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json({
                message:'Updated'
            });
        });
    });
};

exports.photo = (req, res, next) => {
    if(req.image.photo.data){
        res.set('Content-Type', req.image.photo.contentType);
        return res.send(req.image.photo.data);
    }
    next();
};