exports.userSignupValidator = (req,res, next)=>{
    req.check('name', 'Name is required').notEmpty()
    req.check('email','Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
        min:4,
        max:32
    });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage("password must contain a number")
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.adminSignupValidator = (req,res, next)=>{
    req.check('name', 'Name is required').notEmpty()
    req.check('email','Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
        min:4,
        max:32
    });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage("password must contain a number")
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.sellerSignupValidator = (req,res, next)=>{
    req.check('name', 'Name is required').notEmpty()
    req.check('email','Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
        min:4,
        max:32
    });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage("password must contain a number")
    req.check('phone','Phone number is required').notEmpty()
    req.check('phone')
    .isLength({
        min:10,
        max:10
    })
    .withMessage('Phone number should be of 10 digits');
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.agentSignupValidator = (req,res, next)=>{
    req.check('name', 'Name is required').notEmpty()
    req.check('email','Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
        min:4,
        max:32
    });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage("password must contain a number")
    req.check('phone','Phone number is required').notEmpty()
    req.check('phone')
    .isLength({
        min:10,
        max:10
    })
    .withMessage('Phone number should be of 10 digits');
    req.check('commission','Percent commisson is required').notEmpty()
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.productValidator = (req,res, next)=>{
    req.check('name', 'Name is required').notEmpty()
    req.check('description','Description is Required').notEmpty()
    req.check('price', 'Price is required').notEmpty()
    req.check('mrp', 'MRP is required').notEmpty()
    req.check('category', 'Category is required').notEmpty()
    req.check('subCategory', 'SubCategory must not be empty').notEmpty()
    req.check('quantity','Quantity is Required').notEmpty();
    req.check('added_by','Seller id is Required').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.orderValidator = (req, res, next) => {
    req.check('address', 'Address is Required').notEmpty();
    req.check('payment_mode',"Please Select a Payment Method").notEmpty()
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}