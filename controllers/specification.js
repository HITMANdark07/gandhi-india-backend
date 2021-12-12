const Specification = require("../models/specification");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.specificationById = (req, res,next,id) =>{
    Specification.findById(id)
    .exec((err, spec) => {
        if(err || !spec){
            return res.status(400).json({
                error: "Specification not found"
            })
        }
        req.specification = spec;
        next();
    })
}

exports.read = (req, res) => {
    return res.json(req.specification);
}

exports.list = (req,res) => {
    Specification.find()
    .exec((err ,specs) => {
        if(err || !specs){
            return res.status(400).json({
                error:"Unable to find resources"
            })
        }
        return res.json(specs);
    } )
}

exports.create = (req, res) => {
    let specification = new Specification(req.body);
    specification.save((err, spec) => {
        if(err || !spec){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(spec);
    })
}

exports.update = (req, res) => {
    Specification.findOneAndUpdate(
        {id: req.specification._id},
        {$set : req.body},
        {new:true},
        (err, specs) => {
            if(err || !specs){
                return res.status(400).json({
                    error: "Unable to Update your changes"
                })
            }
            return res.json(specs);
        }
    )
}

exports.remove = (req, res) => {
    let specs = req.specification;

    specs.remove((err, spec) => {
        if(err || !spec){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(spec);
    })
}

exports.specificationBySubCategory = (req, res) => {
    Specification.find({subCategory:req.subcategory._id})
    .exec((err, specs) => {
        if(err || !specs){
            return res.status(400).json({
                error:"Specifications not fetched"
            })
        }
        return res.json(specs);
    })
}