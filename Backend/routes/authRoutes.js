const express = require('express');
// Importing the adminLogin function from the authController
const { adminLogin } = require('../controller/authController');
const router = express.Router();
// Admin login route
router.post('/admin/login', adminLogin);

module.exports = router;