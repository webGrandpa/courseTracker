import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

// Интерфейс для нашего "декодированного" токена
interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // 1. Проверяем, есть ли заголовок authorization и начинается ли он с 'Bearer'
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // 2. Получаем сам токен (отрезаем 'Bearer ' из строки)
        token = req.headers.authorization.split(' ')[1];

        // 3. Верифицируем (проверяем) токен
        // jwt.verify "вскрывает" токен с помощью нашего секрета
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as JwtPayload;

        // 4. Находим пользователя в БД по ID из токена
        // Мы "прикрепляем" пользователя к объекту req,
        // чтобы он был доступен во всех следующих контроллерах
        // @ts-ignore
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
           res.status(401);
           throw new Error('User not found');
        }

        // 5. Передаем управление следующему middleware (контроллеру)
        next();
      } catch (error) {
        console.error(error);
        res.status(401); // 401 - Unauthorized
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);