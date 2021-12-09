const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');


const sellerSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    email:{
        type:String,
        trim: true,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        trim:true,
        required:true,
        maxlength:10,
    },
    hashed_password:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        trim: true
    },
    salt:String,
    image:{
        type:String,
    },
    history:{
        type:Array,
        default:[]
    }
}, {timestamps:true}
);

//virtual field

sellerSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt =uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
});

sellerSchema.methods = {
    authenticate : function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex')
        }catch(err){
            return "";
        }
    }
};

module.exports = mongoose.model('Seller', sellerSchema);