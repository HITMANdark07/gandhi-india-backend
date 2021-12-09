const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const ReviewSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:'Product',
        required:true,
    },
    text:{
        type:String,
        trim:true,
        required:true,
        maxlength:1000
    }
},{timestamps:true})

module.exports = mongoose.model("Review", ReviewSchema);