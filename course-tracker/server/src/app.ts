// server/src/app.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import moduleRoutes from './routes/module.routes';
import assignmentRoutes from './routes/assignment.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Express = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // <-- CORS здесь

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/assignments', assignmentRoutes);

app.get('/api/test', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running! 🚀' });
});

// --- ERROR HANDLING MIDDLEWARE ---
app.use(errorHandler);

// ЭКСПОРТИРУЕМ app, НЕ ЗАПУСКАЯ ЕГО
export default app;