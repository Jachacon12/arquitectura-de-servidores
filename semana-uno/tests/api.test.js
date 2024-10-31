const request = require('supertest');
const { app, startServer, stopServer } = require('../index');

describe('Employee API', () => {
  let server;

  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  it('GET /api/employees should return a list of employees', async () => {
    const res = await request(app).get('/api/employees').expect('Content-Type', /json/).expect(200);

    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/employees/oldest should return the oldest employee', async () => {
    const res = await request(app).get('/api/employees/oldest').expect('Content-Type', /json/).expect(200);

    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('age');
  });

  it('GET /api/employees/:name should return an employee by name', async () => {
    const name = 'Sue';
    const res = await request(app).get(`/api/employees/${name}`).expect('Content-Type', /json/).expect(200);

    expect(res.body).toHaveProperty('name', name);
  });

  it('POST /api/employees should add a new employee', async () => {
    const newEmployee = {
      name: 'John Doe',
      age: 50,
      phone: {
        personal: '555-123-123',
        work: '555-456-456',
        ext: '2342',
      },
      privileges: 'user',
      favorites: {
        artist: 'Picasso',
        food: 'pizza',
      },
      finished: [17, 3],
      badges: ['blue', 'black'],
      points: [
        {
          points: 85,
          bonus: 20,
        },
        {
          points: 85,
          bonus: 10,
        },
      ],
    };

    const res = await request(app).post('/api/employees').send(newEmployee).expect('Content-Type', /json/).expect(201);

    expect(res.body.data).toHaveProperty('name', newEmployee.name);
    expect(res.body.data).toHaveProperty('age', newEmployee.age);
  });
});
