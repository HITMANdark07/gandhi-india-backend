const express = require("express");
const router = express.Router();

const { specificationById,list, read, create, update, remove, specificationBySubCategory } = require("../controllers/specification");
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");
const { subcategoryById } = require("../controllers/subcategory");

router.post("/specification/create/:adminId",requireSigninAdmin, isAdmin, create);
router.get('/specification/list', list);
router.get("/specification/details/:specificationId", read);
router.put("/specification/update/:specificationId/:adminId",requireSigninAdmin, isAdmin, update );
router.get("/specification/by-subcategory/:subCategoryId", specificationBySubCategory )
router.delete("/specification/delete/:specificationId/:adminId",requireSigninAdmin, isAdmin,remove);

router.param("specificationId", specificationById);
router.param("subCategoryId", subcategoryById);
router.param("adminId",adminById);

module.exports = router;