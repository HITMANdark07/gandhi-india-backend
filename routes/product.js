const express = require("express");
const router = express.Router();

const { createByAdmin, createBySeller, listByAdmin, productById, listByCategory, listBySubCategory, updateByAdmin, updateBySeller, remove, listBySeller, read} = require("../controllers/product");
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");
const { sellerById, requireSigninSeller, isSeller } = require("../controllers/seller");
const { productValidator } = require("../validator/index");

router.post("/admin/product/add/:adminId",requireSigninAdmin, isAdmin, createByAdmin);
router.post("/seller/product/add/:sellerId",productValidator,requireSigninSeller, isSeller, createBySeller);
router.get("/product/details/:productId", read);
router.get("/admin/product-list/:adminId",requireSigninAdmin, isAdmin, listByAdmin);
router.get("/seller/product-list/:sellerId",requireSigninSeller, isSeller, listBySeller);
router.put("/admin/product/update/:productId/:adminId",requireSigninAdmin, isAdmin,updateByAdmin );
router.put("/seller/product/update/:productId/:sellerId",requireSigninSeller, isSeller,updateBySeller);
router.delete("/admin/product/delete/:productId/:adminId",requireSigninAdmin, isAdmin, remove);
router.get("/product/by-category", listByCategory);
router.get("/product/by-sub-category", listBySubCategory);

router.param("productId",productById);
router.param("sellerId",sellerById);
router.param("adminId",adminById);

module.exports = router;