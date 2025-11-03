// server/src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape } from 'zod';

// 'schema' будет приходить из (registerSchema, loginSchema)
const validate =
  (schema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Zod парсит и валидирует req.body, req.params и req.query
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next(); // Если все в порядке - идем дальше (к контроллеру)
    } catch (error) {
      // Если ошибка валидации - отправляем 400
      return res.status(400).json(error);
    }
  };

export default validate;