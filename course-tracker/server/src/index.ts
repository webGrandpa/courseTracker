// server/src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import courseRoutes from './routes/course.routes';

// Загружаем переменные окружения
dotenv.config();

// Подключаемся к MongoDB
connectDB();

const app: Express = express();

// --- MIDDLEWARES ---
// Это middleware позволяет нам принимать JSON-данные в req.body
app.use(express.json());
// Это middleware позволяет принимать данные из URL-encoded форм
app.use(express.urlencoded({ extended: false }));
// --------------------

const PORT = process.env.PORT || 5001;

// --- ROUTES ---
app.use('/api/auth', authRoutes); // use auth routes
app.use('/api/courses', courseRoutes); // use course routes

app.get('/api/test', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running! 🚀' });
});

// --- ERROR HANDLING MIDDLEWARE ---
app.use(errorHandler);
// ---------------------------------

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});