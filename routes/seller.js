const express = require('express');
const router = express.Router();

const {signUp,signin, signout,list} = require('../controllers/seller');
const { sellerSignupValidator } = require('../validator/index');

router.post("/seller/signup",sellerSignupValidator, signUp);
router.post("/seller/signin", signin);
router.get("/seller/signout", signout);
router.get("/seller/list",list);

module.exports = router;