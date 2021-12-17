const express = require('express');
const router = express.Router();

const {userSignupValidator} = require("../validator/index");
const { signUp, signin,sendUserEmail } = require("../controllers/user");

router.post("/user/activate",userSignupValidator,sendUserEmail);
router.post("/user/signup", signUp);
router.post("/user/signin", signin);

module.exports = router;