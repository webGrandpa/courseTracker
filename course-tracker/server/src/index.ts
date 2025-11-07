// server/src/index.ts
import app from './app'; // <-- 1. Импортируем "созданный" app
import dotenv from 'dotenv';
import connectDB from './config/db';

// 2. Загружаем .env, чтобы 'process.env.PORT' был доступен
dotenv.config();

// 3. Определяем порт
const PORT = process.env.PORT || 5001;

// 4. Функция Start
const startServer = async () => {
  try {
    await connectDB(); // Сначала подключаемся к БД
    
    // Только после успеха БД - запускаем "слушателя"
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
     console.error('🛑 Failed to start server', error)
     process.exit(1)
  }
}

// 5. Запускаем все
startServer();