const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const BankdetailsSchema = new mongoose.Schema({
    seller:{
        type:ObjectId,
        ref:'Seller'
    },
    agent:{
        type:ObjectId,
        ref:'Agent'
    },
    account_number:{
        type:String,
        trim:true,
        required:true,
    },
    IFSC:{
        type:String,
        trim:true,
        required:true
    },
    account_holder_name:{
        type:String,
        trim:true,
    }
},{timestamps:true});

module.exports = mongoose.model("Bankdetails", BankdetailsSchema);