const express = require('express');
const router = express.Router();

const { requireSigninUser, isUser, userById} = require("../controllers/user");
const { create, addressById, remove, addressByUser,read } = require('../controllers/address');

router.post("/create/address/:userId",requireSigninUser, isUser, create);
router.get("/address/:addressId", read);
router.delete("/address/delete/:addressId/:userId", requireSigninUser, isUser, remove);
router.get("/address-by-user/:userId", requireSigninUser, isUser, addressByUser);


router.param("userId",userById);
router.param("addressId",addressById);

module.exports = router;