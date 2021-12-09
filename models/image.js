const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    photo:{
        data: Buffer,
        contentType:String
    }
},{timestamps:true})

module.exports = mongoose.model("Image", ImageSchema);