const request = require('supertest');
const mongoose = require('mongoose');
const { startServer, stopServer } = require('../config/server.config');
const app = require('../server');

let server;
let accessToken;

beforeAll(async () => {
  server = await startServer(app);
});

afterAll(async () => {
  await stopServer();
});

describe('Authentication', () => {
  test('Create a new user POST /api/users - success', async () => {
    try {
      const res = await request(app).post('/api/users').send({
        name: 'Jonas Doe',
        email: 'user@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      accessToken = res.body.token;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  });

  test('Create a new user POST /api/users - failure (missing fields)', async () => {
    try {
      const res = await request(app).post('/api/users').send({
        email: 'wrong@example.com',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Name, email, and password are required');
    } catch (error) {
      console.error('Create user (failure) error:', error);
      throw error;
    }
  });

  test('User login POST /api/login - success', async () => {
    try {
      const res = await request(app).post('/api/login').send({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      accessToken = res.body.accessToken;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  });
});

describe('Protected Routes', () => {
  test('GET /api/citations - without token', async () => {
    try {
      const res = await request(app).get('/api/citations');
      expect(res.statusCode).toBe(401);
    } catch (error) {
      console.error('Get citations (without token) error:', error);
      throw error;
    }
  });

  test('GET /api/citations - with token', async () => {
    try {
      const res = await request(app).get('/api/citations').set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
    } catch (error) {
      console.error('Get citations error:', error);
      throw error;
    }
  });
});
