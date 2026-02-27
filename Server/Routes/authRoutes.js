const express = require("express");
const router = express.Router();
const { googleLogin } = require("../Controllers/authController");

router.post("/google", googleLogin);

module.exports = router;