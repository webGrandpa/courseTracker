// server/src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Убедимся, что .env загружен
dotenv.config();

const connectDB = async () => {
  try {
    // Получаем строку подключения из .env
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('🛑 MONGO_URI is not defined in .env file');
      process.exit(1); // Выходим из приложения, если нет строки подключения
    }

    // Пытаемся подключиться
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`🛑 Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error('🛑 Unknown error connecting to MongoDB');
    }
    process.exit(1); // Выходим из приложения при ошибке
  }
};

export default connectDB;