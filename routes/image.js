const express = require("express");
const router = express.Router();

const { ImageById, create, update,photo, remove } = require("../controllers/image");

router.post("/image/create", create);
router.put("/image/update/:imageId", update);
router.get("/image/photo/:imageId", photo);
router.delete("/image/delete/:imageId",remove);

router.param("imageId", ImageById);

module.exports = router;
