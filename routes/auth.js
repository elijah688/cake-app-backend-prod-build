const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth')

router.post('', authController.signUpUser);

router.post('/login', authController.loginUser);

router.get('/emailUnique/:email', authController.emailUnique);

module.exports = router;