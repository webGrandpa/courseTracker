import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
} from '../controllers/auth.controller';
import validate from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validation/auth.validation';
// import { protect } from '../middleware/protect.ts'; // <-- 1. ИМПОРТИРУЕМ
import { protect } from '../middleware/protect';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

// Private route
// 2. ВСТАВЛЯЕМ 'protect' СЮДА
router.get('/me', protect, getMe);

export default router;