const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/get', userController.getStudents);
router.post('/add', userController.addStudent);

module.exports = router;
