const Order = require("../models/order");
const Coupan = require("../models/coupon");
const Product = require("../models/product");
const {  errorHandler } = require("../helpers/dbErrorHandler");
const seller = require("../models/seller");

exports.orderById = (req, res, next, id) => {
    Order.findById(id).exec((err, order) => {
        if(err || !order){
            res.status(400).json({
                error:"Order not found"
            })
        }
        req.order = order;
        next();
    })
}

exports.read = () => {
    res.json(req.order);
}

exports.create = (req, res) => {
    const {products, coupon,payment_mode, address} = req.body;
    let total_amount =0;
    let total_discount=0;
    const sellers = [];
    const data ={
        products:products,
        address:address,
        payment_mode:payment_mode,
        coupon:coupon,
        user: req.profile._id
        };
    Product.find().where('_id').in(products).exec((err, products) => {
        if(err || !products){
            res.status(400).json({
                error:"Invalid Products"
            })
        }
        products.forEach((prod) => {
            total_amount+=prod.price;
            if(sellers.includes(String(prod.added_by))){

            }else{
                sellers.push(String(prod.added_by));
            }
        })
        
        if(coupon && coupon.trim!==""){
            Coupan.findById(coupon).exec((err, coupon) =>{
                if(err || !coupon){
                    res.status(400).json({
                        error: "INVALID COUPON"
                    })
                }
                req.coupon = coupon;
                if(coupon.type==='percentage'){
                    let ds = ((total_amount*req.coupon.condition)/100).toFixed(2);
                    if(ds<=coupon.max){
                        total_discount = ds;
                    }else{
                        total_discount = coupon.max;
                    }
                }else{
                    total_discount= coupon.condition;
                    if(total <=total_discount){
                        total_discount = total;
                    }else{
                        total_discount = coupon.condition;
                    }ssssssss
                }
                data['total_discount'] = total_discount;
                data['total_amount'] = total_amount-total_discount;
                data['sellers'] = sellers;
                let order = new Order(data);
                order.save((err, od) => {
                    if(err || !od){
                        res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json(od);
                }) 
            })
        }else{
            data['total_amount'] = total_amount;
            data['total_discount'] = total_discount;
            data['sellers'] = sellers;
            let order = new Order(data);
            order.save((err, od) => {
                if(err || !od){
                    res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                res.json(od);
            })
        }
    })
    
};

exports.decreaseQunatity = (req, res, next) => {
    let {products} = req.body;
    let bulkOps = products.map((pro) => {
        return {
            updateOne: {
                filter:{ _id: pro},
                update:{ $inc : {quantity: -1, sold: 1}}
            }
        }
    });
    Product.bulkWrite(bulkOps, {}, (err, products) => {
        if(err){
            res.status(400).json({
                error:errorHandler(err)
            })
        }
        next();
    })
}

exports.update = (req, res) => {
    Order.findOneAndUpdate(
        {_id:req.order._id},
        {$set:req.body},
        {new:true},
        (err, order) => {
            if(err || !order){
                res.status(400).json({
                    error:"Order not updated"
                })
            }
            res.json(order);
        }
    )
}

exports.ordersByUser = (req, res) => {
    Order.find({user:req.profile._id})
    .populate("products", "photo name price")
    .populate("address coupon")
    .sort({createdAt: 'desc'})
    .exec((err, orders) => {
        if(err || !orders){
            res.status(400).json({
                error : errorHandler(err)
            })
        }
        res.json(orders);
    })
}

exports.orderslist = (req, res) => {
    const l = req.query.limit || 10;
    const s = req.query.skip || 0;
    Order.find({})
    .populate("products", "photo name price")
    .populate("address coupon")
    .populate("sellers", "name")
    .sort({createdAt: -1})
    .skip(parseInt(s))
    .limit(parseInt(l))
    .exec((err, orders) => {
        if(err || !orders){
            res.status(400).json({
                error : errorHandler(err)
            })
        }
        res.json(orders);
    })
}
exports.ordersBySeller = (req, res) => {
    Order.find({sellers: { $in :[req.seller._id]}})
    .exec((err, orders) => {
        if(err || !orders){
            res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(orders);
    })
}

exports.bulkToShipped = (req,res) => {
    let bulkOps = req.body.products.map((ord) => {
        return {
            updateOne:{
                filter: { _id: ord},
                update: { $set: { status: 'Shipped'}}
            }
        }
    });
    Order.bulkWrite(bulkOps,{}, (error, products) => {
        if(error){
            res.status(400).json({
                error: errorHandler(error)
            })
        }
        res.json({
            message:"Updated Successfully"
        })
    })
}