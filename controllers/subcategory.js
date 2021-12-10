const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const SubCategory = require('../models/subCategory');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.subcategoryById = (req, res, next, id) => {
    SubCategory.findById(id)
    .exec((err, subcategory)=>{
        if(err || !subcategory) {
            return res.status(400).json({
                error:"Subcategory not found"
            });
        } 
        req.subcategory = subcategory;
        next();
    });
};

exports.read = (req, res)=>{
    req.subcategory.photo = undefined;
    return res.json(req.subcategory);
};

exports.list = (req, res) => {
    SubCategory.find()
    .select("-photo")
    .populate("category", "_id name slug")
    .exec((err,subcategories) => {
        if(err || !subcategories){
            return res.status(400).json({
                error:"Unable to Fetch Subcategories"
            });
        }
        return res.json(subcategories);
    })
}

exports.subcategoriesByCategory = (req, res) => {
    SubCategory.find({category:req.body.category})
    .select("-photo")
    .populate("category", "_id name slug")
    .exec((err, subcategories) => {
        if(err || !subcategories){
            return res.status(400).json({
                error:"Unable to Fetch Subcategories"
            });
        }
        return res.json(subcategories);
    })
}

exports.subcategoryBySlug =(req, res) => {
    SubCategory.findOne({slug:req.body.slug})
        .exec((err, subcategory) => {
            if(err || !subcategory){
                return res.status(400).json({
                    error:"Unable to Fetch Subcategories"
                });
            }
            subcategory.photo=undefined;
            return res.json(subcategory);
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
        const { name, slug, description, category } = fields;

         if(!name || !slug || !description || !category){
            return res.status(400).json({
                error: 'All fields are required'
            });
         }


        let subcategory = new SubCategory(fields);

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
                subcategory.photo.data = fs.readFileSync(files.photo.filepath);
                subcategory.photo.contentType = files.photo.mimetype;
            }else{
                return res.status(400).json({
                    error: 'File path should be correct'
                });
            }
            subcategory.save((err, result)=>{
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

        let subcategory = req.subcategory
        subcategory = _.extend(subcategory, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo){
            //console.log("FILES_PHOTO",files.photo);
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            subcategory.photo.data = fs.readFileSync(files.photo.filepath);
            subcategory.photo.contentType = files.photo.mimetype;
        }
        subcategory.save((err, result)=>{
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
    let subcategory = req.subcategory;
    subcategory.remove((err, deletedSubCategory)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        deletedSubCategory.photo=undefined;
        res.json(deletedSubCategory);
    });
};

exports.photo = (req, res, next) => {
    if(req.subcategory.photo.data){
        res.set('Content-Type', req.subcategory.photo.contentType);
        return res.send(req.subcategory.photo.data);
    }
    next();
};