const express = require('express');
const router = express.Router();

const { coupanById, read, update, create, remove, findByCode } = require('../controllers/coupan');
const { adminById, isAdmin, requireSigninAdmin } = require("../controllers/admin");

router.get("/coupan/:coupanId", read);
router.get("/coupan/code/:codeName", read);
router.post("/create/coupan/:adminId", requireSigninAdmin, isAdmin, create);
router.put("/coupan/update/:coupanId/:adminId", requireSigninAdmin, isAdmin, update);
router.delete("/coupan/:coupanId/:adminId",requireSigninAdmin, isAdmin, remove);

router.param("codeName",findByCode);
router.param("adminId", adminById);
router.param("coupanId", coupanById);

module.exports = router;