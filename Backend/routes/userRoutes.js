import express from 'express';
import * as userController from '../controller/userController.js';

const router = express.Router();
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

export default router;
