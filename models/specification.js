const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const SpecificationSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        unique:true,
        required:true,
        maxlength:32
    },
    options:{
        type:String,
        trim:true,
        required:true
    },
    subCategory:{
        type:ObjectId,
        ref:'SubCategory',
        required:true
    }
},
{timestamps:true}
);


module.exports = mongoose.model('Specification', SpecificationSchema);