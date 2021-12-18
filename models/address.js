const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const AddressSchema = new mongoose.Schema(
  {
    fullName : {
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    pincode: {
        type:String,
        required:true,
    },
    address1:{
        type:String,
        required:true
    },
    address2:{
        type:String,
    },
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    addressType:{
        type:String,
        default:"HOME",
        enum:["HOME","WORK","OTHER"]
    },
    user: { 
        type: ObjectId, 
        ref: "User", 
        required:true, 
    }
  },
  { timestamps: true }
);
 
const Address = mongoose.model("Address", AddressSchema);
 
module.exports = Address;