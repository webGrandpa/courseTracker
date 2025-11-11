import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
} from '../controllers/auth.controller';
import validate from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validation/auth.validation';
import { protect } from '../middleware/protect';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

// Private route
router.get('/me', protect, getMe);

export default router;