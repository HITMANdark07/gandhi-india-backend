const express = require('express');
const router = express.Router();

const {signUp,signin, signout,list, sendSellerEmail} = require('../controllers/seller');
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");
const { sellerSignupValidator } = require('../validator/index');

router.post("/seller/signup",sellerSignupValidator, signUp);
router.post("/seller/send/email/:adminId",requireSigninAdmin, isAdmin, sendSellerEmail);
router.post("/seller/signin", signin);
router.get("/seller/signout", signout);
router.get("/seller/list",list);

router.param("adminId",adminById);

module.exports = router;