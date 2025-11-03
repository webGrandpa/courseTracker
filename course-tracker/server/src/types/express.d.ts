// server/src/types/express.d.ts
import { IUser } from '../models/user.model'; // Импортируем наш интерфейс IUser

declare global {
  namespace Express {
    export interface Request {
      // Говорим TypeScript, что у Request ТЕПЕРЬ ЕСТЬ
      // необязательное (знак '?') свойство 'user'
      user?: IUser | null;
    }
  }
}

// Пустой экспорт, чтобы TypeScript считал этот файл "модулем"
export {};