const mongoose = require('mongoose');

const AgentRequestSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        required:true,
        maxlength:10
    },
    pan:{
        data:Buffer,
        contentType:String,
    },
    id_proof:{
        data:Buffer,
        contentType:String
    },
    photo:{
        data:Buffer,
        contentType:String,
    },
    signature:{
        data:Buffer,
        contentType:String,
    }
},{timestamps:true});

module.exports = mongoose.model("AgentRequest", AgentRequestSchema);