const Product = require('../models/product');
const { errorHandler } = require("../helpers/dbErrorHandler");
const product = require('../models/product');

exports.productById = (req, res, next, id) => {
    Product.findOne({_id:id})
    .exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error:"Product not Found"
            })
        }
        req.product= product;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.product);
}

exports.listBySeller = (req,res) => {
    Product.find({added_by:req.auth._id})
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({
                error: "Unabel to Fetch Products"
            })
        }
        return res.json(products);
    });
};

exports.listByAdmin = (req, res) => {
    Product.find()
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({
                error: "Unabel to Fetch Products"
            })
        }
        return res.json(products);
    });
};

exports.list = (req, res) => {
    Product.find({})
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({
                error: "Unabel to Fetch Products"
            })
        }
        return res.json(products);
    });
};

exports.listByCategory = (req, res) => {
    if(req.body.category){
    Product.find({category:req.body.category})
    .populate("category subCategory","name slug")
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({
                error: "Unabel to Fetch Products"
            })
        }
        return res.json(products);
    });
    }else{
    Product.find()
    .populate("category subCategory","name slug")
    // .find({category:{slug:req.body.slug}})
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({
                error: "Unabel to Fetch Products2"
            })
        }
        products = products.filter((pro) => pro.category.slug===req.body.slug);
        return res.json(products);
    });
    }
}


exports.listBySubCategory = (req, res) => {
    if(req.body.subCategory){
    Product.find({subCategory:req.body.subCategory})
    .populate("category subCategory","name slug")
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({
                error: "Unabel to Fetch Products"
            })
        }
        return res.json(products);
    });
    }else{
    Product.find()
    .populate("category subCategory","name slug")
    // .find({subCategory:{slug:req.body.slug}})
    .exec((err, products) => {
        if(err || !products){
            return res.status(400).json({
                error: "Unabel to Fetch Products"
            })
        }
        products = products.filter((pro) => pro.subCategory.slug===req.body.slug);
        return res.json(products);
    });
    }
};

exports.createBySeller = (req, res) => {
    const requestProduct = {
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        mrp:req.body.mrp,
        category:req.body.category,
        subCategory:req.body.subCategory,
        quantity:req.body.quantity,
        sold:0,
        featured:0,
        photo:req.body.photos,
        shipping:req.body.shipping,
        added_by:req.body.added_by,
        status:0,
        cod:req.body.cod,
        specifications:req.body.specifications
    }
    let product = new Product(requestProduct);

    product.save((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(product);
    })
}
exports.createByAdmin = (req, res) => {
    let product = new Product(req.body);
    product.save((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json(product);
    })
}
exports.updateBySeller = (req,res) => {
    // console.log(req.product);
    Product.findOneAndUpdate(
        {_id: req.product._id},
        {$set : {...req.body, status:req.product.status,sold:req.product.sold}},
        {new: true},
        (err, product) => {
            if(err || !product){
                return res.status(400).json({
                    error: "Unable to Update Product"
                })
            }
            return res.json(product);
        }
    );
}

exports.updateByAdmin = (req,res) => {
    Product.findByIdAndUpdate(
        {_id: req.product._id},
        {$set : req.body},
        {new: true},
        (err, product) => {
            if(err || !product){
                return res.status(400).json({
                    error: "Unable to Update Product"
                })
            }
            return res.json(product);
        }
    )
}

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error:"Unable to delete product"
            })
        }
        return res.json(product);
    })
}