const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

let token;

describe('Authentication', () => {
  test('Create a new user POST /api/users - success', async () => {
    const res = await request(app).post('/api/users').send({
      name: 'Jonas Doe',
      email: 'user@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    console.log('Token:', res.body.token);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('Create a new user POST /api/users - failure', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'wrong@example.com',
    });

    expect(res.statusCode).toBe(500);
  });
  test('User login POST /api/login - success', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    console.log('Token:', res.body.token);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });
});

describe('Protected Routes', () => {
  test('GET /api/citations - without token', async () => {
    const res = await request(app).get('/api/citations');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/citations - with token', async () => {
    const res = await request(app).get('/api/citations').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
