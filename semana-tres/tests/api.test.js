const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { startServer, stopServer } = require('../config/server.config');

let accessToken;

beforeAll(async () => {
  server = await startServer(app);
});

afterAll(async () => {
  await stopServer();
});

describe('Authentication', () => {
  test('Create a new user POST /api/users - success', async () => {
    const res = await request(app).post('/api/users').send({
      name: 'Jonas Doe',
      email: 'user@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
  });

  test('Create a new user POST /api/users - failure (missing fields)', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'wrong@example.com',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Name, email, and password are required');
  });

  test('User login POST /api/login - success', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
    console.log(accessToken);
  });
});

describe('Protected Routes', () => {
  test('GET /api/citations - without token', async () => {
    const res = await request(app).get('/api/citations');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/citations - with token', async () => {
    const res = await request(app).get('/api/citations').set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
