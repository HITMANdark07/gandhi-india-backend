const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    slug:{
        type:String,
        trim:true,
        unique:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    photo:{
        data: Buffer,
        contentType:String
    }
},
{timestamps:true}
);


module.exports = mongoose.model('Category', CategorySchema);