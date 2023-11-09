const fs = require('fs')
const path = require('path')
const request = require('supertest')
const initializeApp = require('../index')

describe('Games', () => {
  let app
  let server
  let token
  let createdGameId
  let gameCode
  let userToken

  beforeAll(async () => {
    const result = await initializeApp
    app = result.app
    server = result.server

    const res = await request(app).post('/svc_game/login').send({
      'email': 'admin@ort.com',
      'password': 'Password1'
    })
    token = res.body.token
  })

  afterAll(async () => {
    await server.close()
    const databaseFile = path.resolve(__dirname, '../my-test-database.db')
    if (fs.existsSync(databaseFile)) {
      setTimeout(() => {
        fs.unlinkSync(databaseFile)
      }, 1000) // delay 1 second
    }
  })

  describe('Happy Path', () => {
    it('should return 200 when get games', async () => {
      const res = await request(app)
        .get('/svc_game/games')
        .set('Authorization', token);
      expect(res.statusCode).toEqual(200);
    });

    it('should return 201 when create game', async () => {
      const res = await request(app)
        .post('/svc_game/games')
        .set('Authorization', token)
        .send({
          'name': 'Nuevo Juego 5',
          'players': 2,
          "initialMoney": 5000,
          "startDate": new Date(),
          "endDate": new Date() + 7
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual('Nuevo Juego 5');
      expect(res.body.UserGameInfos.length).toEqual(2);
      createdGameId = res.body.id;
      gameCode = res.body.UserGameInfos[0].code;
    });

    it('should return 200 when get one game', async () => {
      const res = await request(app)
        .get('/svc_game/games/' + createdGameId)
        .set('Authorization', token);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual('Nuevo Juego 5');
    });

    it('should return 200 when get all games', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test2@test.com',
        'password': '1234567890.jk',
        'code': gameCode
      })
      expect(res.statusCode).toEqual(201)
      userToken = res.headers.authorization
      const userHeader = { 'Authorization': userToken }
      const res2 = await request(app)
        .get('/svc_game/games')
        .set(userHeader);
      expect(res2.statusCode).toEqual(200);
      expect(res2.body.length).toEqual(1);
    });

    it('should return 200 when get one game', async () => {
      const res = await request(app)
        .put('/svc_game/games/' + createdGameId)
        .set('Authorization', userToken);
      expect(res.statusCode).toEqual(200);
    });

    it('should return 200 when get my game', async () => {
      const res = await request(app)
        .get('/svc_game/mygame')
        .set('Authorization', userToken);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Sad Path', () => {
    it('should return 400 when create game with existing name', async () => {
      const res = await request(app)
        .post('/svc_game/games')
        .set('Authorization', token)
        .send({
          'name': 'Nuevo Juego 5',
          'players': 2,
          "initialMoney": 5000,
          "startDate": new Date(),
          "endDate": new Date() + 7
        });
      expect(res.statusCode).toEqual(409);
    });

    it('should return 404 when get one game with invalid id', async () => {
      const res = await request(app)
        .get('/svc_game/games/9999999')
        .set('Authorization', token);
      expect(res.statusCode).toEqual(404);
    });

    it('should return 404 when select invalid game', async () => {
      const res = await request(app)
        .put('/svc_game/games/9999999')
        .set('Authorization', userToken);
      expect(res.statusCode).toEqual(404);
    });

    it('should return 404 when select game not registered', async () => {
      let prevId = createdGameId - 1;
      const res = await request(app)
        .put('/svc_game/games/' + prevId)
        .set('Authorization', userToken);
      expect(res.statusCode).toEqual(404);
    });
  });
});
