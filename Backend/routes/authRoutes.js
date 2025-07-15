import express from 'express';
// Importing the adminLogin function from the authController
import { adminLogin } from '../controller/authController.js';

const router = express.Router();
// Admin login route
router.post('/admin/login', adminLogin);

export default router;