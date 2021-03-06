const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32
    },
    mrp:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32
    },
    category:[
        {
        type:ObjectId,
        ref:'Category',
        required:true,
        }
    ],
    subCategory:{
        type:ObjectId,
        ref:'SubCategory',
        required:true,
    },
    quantity:{
        type: Number,
        required:true,
        default:0
    },
    sold:{
        type: Number,
        default:0,
    },
    featured:{
        type:Number,
        default:0,
    },
    photo:{
        type:Array,
        default:[]
    },
    shipping:{
        required:false,
        type: Boolean
    },
    added_by:{
        type:ObjectId,
        ref:'Seller',
        required:true,
    },
    status:{
        type:Number,
        default:0  // 0 not live 1 live
    },
    cod:{
        type:Number,
        default:1,
    },
    specifications:[
        {
            name:{
                type:String
            },
            value:{
                type:String
            }
        }
    ]
}, 
{timestamps:true}
);


module.exports = mongoose.model('Product', productSchema);