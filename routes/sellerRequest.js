const express = require("express");
const router = express.Router();

const { sellerRequestById, create, remove, photo, pan, id_proof,signature, read } = require("../controllers/sellerRequest");

router.post("/seller/kyc", create);
router.get("/seller/kyc/details/:sellerRequestId", read);
router.get("/seller/kyc/photo/:sellerRequestId", photo);
router.get("/seller/kyc/pan/:sellerRequestId", pan);
router.get("/seller/kyc/id-proof/:sellerRequestId", id_proof);
router.get("/seller/kyc/signature/:sellerRequestId", signature);
router.delete("/seller/kyc/delete/:sellerRequestId",remove);

router.param("sellerRequestId", sellerRequestById);

module.exports = router;