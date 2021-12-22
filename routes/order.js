const express = require('express');
const router = express.Router();

const { create, ordersByUser, orderslist } = require('../controllers/order');

const { requireSigninUser, isUser, userById} = require("../controllers/user");
const { requireSigninAdmin, isAdmin, adminById} = require("../controllers/admin");
const { orderValidator } = require('../validator');

router.post("/order/create/:userId", orderValidator, requireSigninUser, isUser, create);
router.get("/orders/:userId", requireSigninUser, isUser, ordersByUser);
router.get("/orders/list/:adminId", requireSigninAdmin, isAdmin, orderslist);

router.param("userId", userById);
router.param("adminId", adminById);


module.exports = router;