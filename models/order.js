const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    products : [{
        type:ObjectId,
        ref:'Product'
    }],
    address:{
        type:ObjectId,
        ref:'Address',
        required:true
    },
    payment_mode:{
        type:String,
        default: "COD",
        enum: ["COD", "ONLINE"]
    },
    sellers:[
      {
          type:ObjectId,
          ref:'Seller'
      }
    ],
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
    user: { type: ObjectId, ref: "User", required:true }
  },
  { timestamps: true }
);
 
const Order = mongoose.model("Order", OrderSchema);
 
module.exports = Order;