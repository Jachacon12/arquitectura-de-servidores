const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const { startServer, stopServer } = require('../config/server.config');
const Citation = require('../models/citation.model');

let server;

beforeAll(async () => {
  server = await startServer(app);
});

afterAll(async () => {
  await stopServer();
});

beforeEach(async () => {
  await Citation.deleteMany({});
});

describe('Citation API', () => {
  it('should create a new citation', async () => {
    const res = await request(app).post('/api/citations').send({
      title: 'Test title',
      text: 'Test citation',
      author: 'Test Author',
      id: '67201ed0c5f71234c3029be3',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.text.length).toBeGreaterThan(0);
    expect(res.body.author.length).toBeGreaterThan(0);
  });

  it('should get all citations', async () => {
    // Create some test citations
    await Citation.create({
      title: 'Test title 1',
      text: 'Test citation 1',
      author: 'Test Author 1',
      id: '67201ed0c5f71234c3029be1',
    });
    await Citation.create({
      title: 'Test title 2',
      text: 'Test citation 2',
      author: 'Test Author 2',
      id: '67201ed0c5f71234c3029be2',
    });

    // Wait for a short time to ensure database operations are complete
    await new Promise((resolve) => setTimeout(resolve, 100));
    const res = await request(app).get('/api/citations');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('text');
      expect(res.body[0]).toHaveProperty('author');
      expect(res.body[0]).toHaveProperty('id');
    }
  });

  it('should get a citation by id', async () => {
    const citation = await Citation.create({
      title: 'Test title',
      text: 'Test citation',
      author: 'Test Author',
      id: '67201ed0c5f71234c3029be1',
    });

    const res = await request(app).get(`/api/citations/${citation._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Test citation');
    expect(res.body.author).toBe('Test Author');
  });

  it('should update a citation', async () => {
    const citation = await Citation.create({
      title: 'Test title',
      text: 'Old citation',
      author: 'Test Author',
      id: '67201ed0c5f71234c3029be1',
    });

    const res = await request(app)
      .patch(`/api/citations/${citation._id}`)
      .send({ text: 'Updated citation', author: 'Updated Author' });
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Updated citation');
    expect(res.body.author).toBe('Updated Author');
  });
  it('should delete a citation', async () => {
    const citation = await Citation.create({
      title: 'Test title',
      text: 'Test citation',
      author: 'Test Author',
      id: '67201ed0c5f71234c3029be1',
    });
    const res = await request(app).delete(`/api/citations/${citation._id}`);
    expect(res.statusCode).toBe(204);
    expect(await Citation.findById(citation._id)).toBeNull();
  });

  it('should return 404 for non-existent citation', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/citations/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
