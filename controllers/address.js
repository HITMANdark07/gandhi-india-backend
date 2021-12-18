const Address = require('../models/address');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.addressById = (req, res, next,id) => {
    Address.findById(id).exec((err, address) => {
        if(err || !address){
            res.status(400).json({
                error: "Address not found"
            })
        }
        req.address = address;
        next();
    })
} 
exports.read = (req, res) => {
    res.json(req.address);
}

exports.create = (req,res) => {
    let address = new Address(req.body);
    address.save((err, add) => {
        if(err || !add){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(add);
    })
}


exports.remove = (req, res) => {
    Address.findOneAndDelete({_id:req.address._id})
    .exec((err , address) => {
        if(err || !address){
            return res.status(400).json({
                error: errorHandler
            })
        }
        res.json(address);
    })
}

exports.addressByUser = (req, res) => {
    Address.find({user:req.profile._id})
    .exec((err, users) => {
        if(err || !users){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(users);
    })
}