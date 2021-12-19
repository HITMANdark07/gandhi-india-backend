const Coupan = require("../models/coupon");
const { errorHand, errorHandler} = require("../helpers/dbErrorHandler");

exports.coupanById = (req, res, next, id) => {
    Coupan.findById(id).exec((err, coupan) => {
        if(err || !coupan){
            res.status(400).json({
                error:"Coupan not Found"
            })
        }
        req.coupan = coupan;
        next();
    })
}

exports.read = (req, res) => {
    res.json(req.coupan);
}

exports.findByCode = (req, res, next, code) => {
    Coupan.findOne({code:code}).exec((err, coupan) => {
        if(err || !coupan){
            res.status(400).json({
                error:"coupan not found"
            })
        }
        req.coupan = coupan;
        next();
    })
}
exports.create = (req, res) => {
    const coupan = new Coupan(req.body);
    coupan.save((err, coupan) => {
        if(err || !coupan){
            res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(coupan);
    })
}

exports.update = (req, res) => {
    Coupan.findOneAndUpdate(
        {_id:req.coupan._id},
        {$set : req.body},
        {new : true},
        (err, coupan) => {
            if(err || !coupan){
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(coupan);
        }
    )
}

exports.remove = (req, res) => {
    let coupan = req.coupan;
    coupan.remove((err, coupan) => {
        if(err || !coupan){
            res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(coupan);
    })
}