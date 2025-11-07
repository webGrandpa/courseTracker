// server/src/__tests__/auth.test.ts
import request from 'supertest'; // "Фейковый пользователь"
import mongoose from 'mongoose';
import app from '../app'; // <-- Наш Express app (БЕЗ 'listen')
import connectDB from '../config/db';
import User from '../models/user.model'; // Нам нужен User, чтобы "почистить" БД

// 1. Подключаемся к Тестовой БД ПЕРЕД всеми тестами
beforeAll(async () => {
  await connectDB(); // Он "увидит" NODE_ENV=test
});

// 2. Отключаемся ПОСЛЕ всех тестов
afterAll(async () => {
  await mongoose.connection.close();
});

// 3. ЧИСТИМ БД ПОСЛЕ КАЖДОГО теста
afterEach(async () => {
  await User.deleteMany({});
});

// 4. "Группа" тестов для Auth
describe('Auth API (POST /api/auth)', () => {

  // Тест-кейс 1: Успешная регистрация
  test('POST /register - should register a new user', async () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app) // "Фейковый пользователь" берет 'app'
      .post('/api/auth/register') // ...отправляет POST
      .send(testUser); // ...с этими данными

    // Проверки (Expectations)
    expect(res.statusCode).toBe(201); // Ожидаем 201 (Created)
    expect(res.body).toHaveProperty('token'); // Ожидаем, что в ответе есть 'token'
    expect(res.body.email).toBe(testUser.email);
  });

  // Тест-кейс 2: Неудачная регистрация (дубликат)
  test('POST /register - should fail if user already exists', async () => {
    // 1. Сначала создаем юзера
    await User.create({
      email: 'duplicate@example.com',
      password: 'password123',
    });

    // 2. Пытаемся создать ЕГО ЖЕ
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'password123',
      });

    // Проверки
    expect(res.statusCode).toBe(400); // Ожидаем 400 (Bad Request)
    expect(res.body.message).toBe('User already exists');
  });

  // (Здесь ты бы добавил тесты для 'POST /login')
});