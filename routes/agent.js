const express = require('express');
const router = express.Router();

const {signUp,signin, signout} = require('../controllers/agent');
const { agentSignupValidator } = require('../validator/index');

router.post("/agent/signup",agentSignupValidator, signUp);
router.post("/agent/signin", signin);
router.get("/agent/signout", signout);


module.exports = router;