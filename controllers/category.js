const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
    .exec((err, category)=>{
        if(err || !category) {
            return res.status(400).json({
                error:"Category not found"
            });
        } 
        req.category = category;
        next();
    });
};

exports.read = (req, res)=>{
    req.category.photo = undefined;
    return res.json(req.category);
};

exports.list = (req, res) => {
    Category.find()
    .select("-photo")
    .exec((err,categories) => {
        if(err || !categories){
            return res.status(400).json({
                error:"Unable to Fetch Categories"
            });
        }
        return res.json(categories);
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
        const { name, slug, description } = fields;

         if(!name || !slug || !description){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }


        let category = new Category(fields);

        // 1kb = 1000 ~ 
        // 1mb = 1000000 ~

        if(files.photo){
            // console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'File Size should less than 1mb'
                });
            }
            if(files.photo.filepath){
                category.photo.data = fs.readFileSync(files.photo.filepath);
                category.photo.contentType = files.photo.mimetype;
            }else{
                return res.status(400).json({
                    error: 'File path should be correct'
                });
            }
            category.save((err, result)=>{
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                result.photo=undefined;
                res.json(result);
            });
        }else{
            return res.status(400).json({
                error: 'All fields are required'
            });
        }   
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

        let category = req.category
        category = _.extend(category, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            category.photo.data = fs.readFileSync(files.photo.filepath);
            category.photo.contentType = files.photo.mimetype;
        }
        category.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            result.photo=undefined;
            res.json(result);
        });
    });
};

exports.remove = (req,res) => {
    let category = req.category;
    category.remove((err, deletedCategory)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        deletedCategory.photo=undefined;
        res.json(deletedCategory);
    });
};

exports.photo = (req, res, next) => {
    if(req.category.photo.data){
        res.set('Content-Type', req.category.photo.contentType);
        return res.send(req.category.photo.data);
    }
    next();
};