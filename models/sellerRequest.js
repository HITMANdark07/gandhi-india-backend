const mongoose = require('mongoose');

const SellerRequestSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
    },
    pan:{
        type:Buffer,
        contentType:String,
        required:true,
    },
    id_proof:{
        type:Buffer,
        contentType:String,
        required:true,
    },
    photo:{
        type:Buffer,
        contentType:String,
        required:true,
    },
    signature:{
        type:Buffer,
        contentType:String,
        required:true,
    }
},{timestamps:true})

module.exports = mongoose.model("SellerSchema", SellerRequestSchema);