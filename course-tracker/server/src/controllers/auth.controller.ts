import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';

// --- Вспомогательная функция для генерации JWT ---
const generateToken = (id: string) => {
  // 'process.env.JWT_SECRET' - это наш секретный ключ. Мы должны его создать!
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined in .env file');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Токен будет "жить" 30 дней
  });
};

// --- 1. Контроллер для Регистрации ---
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); 
    throw new Error('User already exists');
  }

  // БЕЗ 'as IUser'
  const user = await User.create({
    email,
    password,
  });

  if (user) {
    res.status(201).json({ 
      _id: user._id, // <-- Ошибка должна исчезнуть
      email: user.email,
      token: generateToken(user._id.toString()), // <-- Ошибка должна исчезнуть
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// --- 2. Контроллер для Логина ---
// @desc    Authenticate (login) a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // БЕЗ 'as IUser | null'
  const user = await User.findOne({ email }).select('+password');

  // 'user' здесь может быть 'null', поэтому 'if (user && ...)'
  // TypeScript это понимает и внутри 'if' 'user' уже не 'null'
  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id, // <-- Ошибка должна исчезнуть
      email: user.email,
      token: generateToken(user._id.toString()), // <-- Ошибка должна исчезнуть
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// --- 3. Контроллер для получения 'Me' (себя) ---
// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private (мы добавим 'protect' middleware позже)
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // Мы УЖЕ получили пользователя из 'protect' middleware!
  // Он находится в 'req.user'
  
  // УБИРАЕМ @ts-ignore
  const user = req.user; 

  if (user) {
    res.json({
      _id: user._id,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found (from getMe)'); // Эта ошибка не должна случиться
  }
});