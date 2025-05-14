const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
// Get all students
router.get('/get', userController.getStudents);
// Add new student
router.post('/add', userController.addStudent);
// Update student
router.post('/update', userController.updateStudent);
// Delete student
router.delete('/delete/:PRN', userController.deleteStudent);
// // Get student by PRN
// router.get('/get/:PRN', userController.getStudentByPRN);

module.exports = router;
