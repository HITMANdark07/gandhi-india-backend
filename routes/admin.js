const express = require('express');
const router = express.Router();

const {signUp,signin, signout} = require('../controllers/admin');
const { adminSignupValidator } = require('../validator/index');

router.post("/admin/signup",adminSignupValidator, signUp);
router.post("/admin/signin", signin);
router.get("/admin/signout", signout);


module.exports = router;