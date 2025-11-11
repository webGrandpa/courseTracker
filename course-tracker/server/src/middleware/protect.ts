import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

// დეკოდერის ინტერფეისი
interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // ვამოწმებთ გვაქვს თუ არა ჰედერი და აქვს თუ არა მას ბეარერ ტოკქნი
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        //ვღებულობთ ტოკენს
        token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as JwtPayload;

        // ვეძებთ მომხმ თოქ იდ
        
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
           res.status(401);
           throw new Error('User not found');
        }

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);