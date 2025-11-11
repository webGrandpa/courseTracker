import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';

// JWT generacia
const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined in .env file');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- registraciis kontroleri ---
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

 
  const user = await User.create({
    email,
    password,
  });

  if (user) {
    res.status(201).json({ 
      _id: user._id, 
      email: user.email,
      token: generateToken(user._id.toString()), 
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// --- loginis kontroleri ---
// @desc    Authenticate (login) a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// --- me kotroleri ---
// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private 
export const getMe = asyncHandler(async (req: Request, res: Response) => {

    const user = req.user; 

  if (user) {
    res.json({
      _id: user._id,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found (from getMe)');
  }
});