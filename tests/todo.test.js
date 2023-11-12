const fs = require('fs');
const path = require('path');
const request = require('supertest');
const initializeApp = require('../index');
const { DB_SQLITE_FILE } = require('../config');

describe('Todo', () => {
  let app
  let server
  let cacheService
  let createdTodoId
  let count_created = 0

  beforeAll(async () => {
    const result = await initializeApp
    app = result.app
    server = result.server
    cacheService = result.cacheService
    // wait for server to start
    await new Promise((resolve) => setTimeout(() => resolve(), 1500))
  })

  afterAll(async () => {
    await server.close()
    await cacheService.stop()
    const databaseFile = path.resolve(__dirname, `../test_${DB_SQLITE_FILE}`)
    if (fs.existsSync(databaseFile)) {
      setTimeout(() => {
        fs.unlinkSync(databaseFile)
      }, 1000)
    }
  })

  describe('Happy Path', () => {
    it('should return 200 when get todos', async () => {
      const res = await request(app)
        .get('/todo');
      expect(res.statusCode).toEqual(200);
      count_created = res.body.length + 1
    });

    it('should return 201 when create a todo', async () => {
      const res = await request(app)
        .post('/todo')
        .send({
          'title': 'Test',
          'description': 'Test'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toEqual('Test');
      expect(res.body.description).toEqual('Test');
      createdTodoId = res.body.id;
    });

    it('should return 200 when get all todos', async () => {
      const res = await request(app)
        .get('/todo');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(count_created);
    });
  });

  describe('Sad Path', () => {
    it('should return 400 when create todo without title', async () => {
      const res = await request(app)
        .post('/todo')
        .send({
          'description': 'Test'
        });
      expect(res.statusCode).toEqual(400);
    });
  });
});
