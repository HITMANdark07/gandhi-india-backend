const express = require("express");
const router = express.Router();

const { categoryById, create, remove, photo, update, read,list, categoryBySlug } = require("../controllers/category");
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");

router.post("/admin/cateogry/add/:adminId",requireSigninAdmin, isAdmin, create);
router.get("/category-list", list);
router.put("/admin/category/update/:categoryId/:adminId",requireSigninAdmin, isAdmin, update);
router.delete("/admin/category/delete/:categoryId/:adminId",requireSigninAdmin, isAdmin, remove);
router.get("/category/:categoryId", read);
router.get("/category-slug", categoryBySlug);
router.get("/category/photo/:categoryId",photo);

router.param("categoryId", categoryById);
router.param("adminId",adminById);

module.exports = router;