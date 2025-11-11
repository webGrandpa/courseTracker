// server/src/__tests__/course.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import connectDB from '../config/db';
import User from '../models/user.model';
import Course from '../models/course.model';

let token: string; 
let userId: string;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});

  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'testuser@courses.com',
      password: 'password123',
    });

  token = res.body.token;
  userId = res.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
  await Course.deleteMany({});
});

describe('Courses API (GET /api/courses)', () => {

  test('GET /courses - should fail with 401 if no token is provided', async () => {
    const res = await request(app).get('/api/courses');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Not authorized, no token');
  });

  test('GET /courses - should return user\'s courses if token is provided', async () => {
    await Course.create({
      title: 'Test Course 1',
      user: userId,
    });

    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Test Course 1');
  });

});