const express = require("express");
const router = express.Router();

const { subcategoryById,subcategoriesByCategory, create, remove, photo, update, read,list, subcategoryBySlug } = require("../controllers/subcategory");
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");

router.post("/admin/sub-cateogry/add/:adminId",requireSigninAdmin, isAdmin, create);
router.get("/sub-category-list", list);
router.get("/sub-category-by/category", subcategoriesByCategory);
router.put("/admin/sub-category/update/:subcategoryId/:adminId",requireSigninAdmin, isAdmin, update);
router.delete("/admin/sub-category/delete/:subcategoryId/:adminId",requireSigninAdmin, isAdmin, remove);
router.get("/sub-category/:subcategoryId", read);
router.get("/sub-category-slug", subcategoryBySlug);
router.get("/sub-category/photo/:subcategoryId",photo);

router.param("subcategoryId", subcategoryById);
router.param("adminId",adminById);

module.exports = router;