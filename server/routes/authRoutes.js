import express from 'express';
import { login, getProfile, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { loginValidation, handleValidationErrors } from '../utils/validationUtils.js';

const router = express.Router();

router.post('/login', loginValidation, handleValidationErrors, login);
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);

export default router;