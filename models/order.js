const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    products : [{
        type:ObjectId,
        ref:'Product'
    }],
    city:{
        type:String
    },
    transaction_id: {
        type:String,
        required:true,
    },
    pincode:{
        type:Number,
        required:true
    },
    payment_mode:{
        type:String,
        default: "COD",
        enum: ["COD", "ONLINE"]
    },
    payment_status:{
      type:Number,
      default:0
    },
    coupon:{
        type:ObjectId,
        ref:'Coupon'
    },
    total_amount: { type: Number },
    total_discount: { type: Number },
    address: {
      type:ObjectId,
      required:true,
      ref:'Address'
    },
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Processing", "Delivered", "Cancelled","Refunded"] // enum means string objects
    },
    updated: Date,
    user: { type: ObjectId, ref: "User" }
  },
  { timestamps: true }
);
 
const Order = mongoose.model("Order", OrderSchema);
 
module.exports = Order;