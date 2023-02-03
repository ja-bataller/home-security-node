const express = require('express');
const authController = require('../controller/authController')

const router = express.Router();

router.post('/verify', authController.verify)
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgot', authController.forgotPassword)
router.post('/reset', authController.resetPassword)

module.exports = router;