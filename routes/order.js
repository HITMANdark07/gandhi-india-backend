const express = require('express');
const router = express.Router();

const { create } = require('../controllers/order');

const { requireSigninUser, isUser, userById} = require("../controllers/user");
const { orderValidator } = require('../validator');

router.post("/order/create/:userId", orderValidator, requireSigninUser, isUser, create);


router.param("userId", userById);


module.exports = router;