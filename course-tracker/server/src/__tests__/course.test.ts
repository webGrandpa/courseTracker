// server/src/__tests__/course.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import connectDB from '../config/db';
import User from '../models/user.model';
import Course from '../models/course.model'; // <-- Нужна модель Курса

// --- Переменные для хранения "состояния" ---
let token: string; // "Коробка" для нашего токена
let userId: string; // "Коробка" для ID юзера

// 1. Подключаемся к Тестовой БД ПЕРЕД всеми тестами
beforeAll(async () => {
  await connectDB();
});

// 2. "Логинимся" (Регистрируемся) ОДИН РАЗ перед тестами в этой "группе"
// `beforeEach` (перед каждым) или `beforeAll` (один раз)
beforeEach(async () => {
  // Чистим юзеров на всякий случай
  await User.deleteMany({});

  // Регистрируем "тестового" юзера
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'testuser@courses.com',
      password: 'password123',
    });

  // Сохраняем "пропуск" (токен) и ID
  token = res.body.token;
  userId = res.body._id;
});

// 3. Отключаемся ПОСЛЕ всех тестов
afterAll(async () => {
  await mongoose.connection.close();
});

// 4. ЧИСТИМ ВСЕ БД ПОСЛЕ КАЖДОГО теста
afterEach(async () => {
  await User.deleteMany({});
  await Course.deleteMany({}); // <-- Чистим и Курсы
});

// --- "Группа" тестов для Courses ---
describe('Courses API (GET /api/courses)', () => {

  // Тест-кейс 1: Неудачная попытка (БЕЗ токена)
  test('GET /courses - should fail with 401 if no token is provided', async () => {
    const res = await request(app).get('/api/courses'); // <-- БЕЗ токена

    // Проверки
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Not authorized, no token');
  });

  // Тест-кейс 2: Успешная попытка (С токеном)
  test('GET /courses - should return user\'s courses if token is provided', async () => {
    // 1. Сначала создадим "тестовый" курс для нашего юзера
    await Course.create({
      title: 'Test Course 1',
      user: userId, // <-- Привязываем к нашему юзеру
    });

    // 2. "Звоним" на эндпоинт, "прикрепляя" токен
    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`); // <-- "Предъявляем пропуск"

    // Проверки
    expect(res.statusCode).toBe(200); // Ожидаем 200 (OK)
    expect(res.body).toBeInstanceOf(Array); // Ожидаем массив
    expect(res.body.length).toBe(1); // Ожидаем 1 курс
    expect(res.body[0].title).toBe('Test Course 1');
  });

  // (Здесь ты бы добавил тест для 'POST /api/courses')
});