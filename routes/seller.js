const express = require('express');
const router = express.Router();

const {signUp,signin, signout} = require('../controllers/seller');
const { sellerSignupValidator } = require('../validator/index');

router.post("/seller/signup",sellerSignupValidator, signUp);
router.post("/seller/signin", signin);
router.get("/seller/signout", signout);


module.exports = router;