const express = require('express');
const router = express.Router();

const {register, login, forgetpassword, resetpassword} = require('../controllers/auth.js');

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgetpassword").post(forgetpassword);
router.route("/resetpassword/:resetToken").put(resetpassword);

module.exports = router;