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
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
router.post(

  '/upload-excelbook',
  upload.single('file'),
  userController.uploadBooksExcel
);

router.post(
  "/upload-excel",
  upload.single("file"),
  userController.uploadStudentsExcel
);
export default router;
