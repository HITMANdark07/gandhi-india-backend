const express = require('express');
const router = express.Router();

const { coupanById, read, update, create, remove } = require('../controllers/coupan');
const { adminById, isAdmin, requireSigninAdmin } = require("../controllers/admin");

router.get("/coupan/:coupanId", read);
router.post("/create/coupan/:adminId", requireSigninAdmin, isAdmin, create);
router.put("/coupan/upadte/:coupanId/:adminId", requireSigninAdmin, isAdmin, update);
router.delete("/coupan/:coupanId/:adminId",requireSigninAdmin, isAdmin, remove);

router.param("adminId", adminById);
router.param("coupanId", coupanById);

module.exports = router;