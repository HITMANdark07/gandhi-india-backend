const express = require('express');
const router = express.Router();

const { create, ordersByUser } = require('../controllers/order');

const { requireSigninUser, isUser, userById} = require("../controllers/user");
const { orderValidator } = require('../validator');

router.post("/order/create/:userId", orderValidator, requireSigninUser, isUser, create);
router.get("/orders/:userId", requireSigninUser, isUser, ordersByUser);

router.param("userId", userById);


module.exports = router;