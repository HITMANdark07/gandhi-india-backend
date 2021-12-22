const express = require('express');
const router = express.Router();

const { create, ordersByUser, orderslist, decreaseQunatity, bulkToShipped, update, orderById } = require('../controllers/order');

const { requireSigninUser, isUser, userById} = require("../controllers/user");
const { requireSigninAdmin, isAdmin, adminById} = require("../controllers/admin");
const { orderValidator } = require('../validator');

router.post("/order/create/:userId", orderValidator, requireSigninUser, isUser,decreaseQunatity, create);
router.put("/order/update/:orderId/:adminId", requireSigninAdmin, isAdmin, update);
router.get("/orders/:userId", requireSigninUser, isUser, ordersByUser);
router.get("/orders/list/:adminId", requireSigninAdmin, isAdmin, orderslist);
router.put("/order/bulk/status/:adminId", requireSigninAdmin, isAdmin,bulkToShipped);

router.param("orderId", orderById);
router.param("userId", userById);
router.param("adminId", adminById);


module.exports = router;