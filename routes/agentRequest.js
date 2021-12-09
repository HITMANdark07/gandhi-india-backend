const express = require("express");
const router = express.Router();

const { agentRequestById, create, remove, photo, pan, id_proof,signature, read, list } = require("../controllers/agentRequest");

router.post("/agent/kyc", create);
router.post("/agent/kyc/list", list);
router.get("/agent/kyc/details/:agentRequestId", read);
router.get("/agent/kyc/photo/:agentRequestId", photo);
router.get("/agent/kyc/pan/:agentRequestId", pan);
router.get("/agent/kyc/id-proof/:agentRequestId", id_proof);
router.get("/agent/kyc/signature/:agentRequestId", signature);
router.delete("/agent/kyc/delete/:agentRequestId",remove);

router.param("agentRequestId", agentRequestById);

module.exports = router;