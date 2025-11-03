// server/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Определяем HTTP-статус. Если он 200 (OK), значит, ошибка была,
  // но статус не поменяли, ставим 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Мы показываем 'stack' (путь ошибки) только в режиме разработки
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};