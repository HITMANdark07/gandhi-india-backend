const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
    code:{
        type:String,
        trim:true,
        required:true,
    },
    type:{
        type:String,
        default: "percentage",
        enum: ["percentage", "flat"]
    },
    condition:{
        type:Number,
    },
    max:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        trim:true,
        required:true,
        maxlength:1000
    }
},{timestamps:true})

module.exports = mongoose.model("Coupon", CouponSchema);