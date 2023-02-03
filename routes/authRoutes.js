const express = require('express');
const authController = require('../controller/authController')

const router = express.Router();

router.post('/verify', authController.verify)
router.post('/signup', authController.signup)
router.post('/login', authController.login)

module.exports = router;