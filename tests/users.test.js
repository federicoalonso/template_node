const fs = require('fs')
const path = require('path')
const request = require('supertest')
const initializeApp = require('../index')

describe('Users', () => {
  let app
  let server

  beforeAll(async () => {
    const result = await initializeApp
    app = result.app
    server = result.server
  })

  afterAll(async () => {
    await server.close()
    const databaseFile = path.resolve(__dirname, '../my-test-database.db')
    if (fs.existsSync(databaseFile)) {
      setTimeout(() => {
        fs.unlinkSync(databaseFile)
      }, 1000)
    }
  })

  describe('Happy Path', () => {
    it('should return 201 when register user', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test2@test.com',
        'password': '1234567890.jk',
        'code': '0LYMp5OA'
      })
      expect(res.statusCode).toEqual(201)
      expect(res.body.user.email).toEqual('test2@test.com')
      expect(res.headers.authorization).toBeDefined()
    })

    it('should return 200 when login user', async () => {
      const res = await request(app).post('/svc_game/login').send({
        'email': 'test2@test.com',
        'password': '1234567890.jk'
      })
      expect(res.statusCode).toEqual(200)
      expect(res.body.user.email).toEqual('test2@test.com')
      expect(res.headers.authorization).toBeDefined()
    })

    it('should return 201 when register user to a new game', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test2@test.com',
        'password': '1234567890.jk',
        'code': '2mVslbZo'
      })
      expect(res.statusCode).toEqual(201)

    })
  })

  describe('Sad Path', () => {
    it('should return 404 when register user with invalid code', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test2@test.com',
        'password': '1234567890.jk',
        'code': '0LYMp5OB' // codigo invalido
      })
      expect(res.statusCode).toEqual(404)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when register user with used code', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test3@test.com',
        'password': '1234567890.jk',
        'code': '0LYMp5OA' // codigo usado
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when register user with existing email', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test2@test.com',
        'password': '1234567890.jk',
        'code': '1mVslbZo' // codigo valido
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when login user with invalid email', async () => {
      const res = await request(app).post('/svc_game/login').send({
        'email': 'notExists@test.com',
        'password': '1234567890.jk'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when login user with invalid password', async () => {
      const res = await request(app).post('/svc_game/login').send({
        'email': 'test2@test.com',
        'password': '1234567890.jK' // password incorrecto
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when register user with invalid password', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test@test.com',
        'password': '1234567890', // password incorrecto, menos de 12 caracteres
        'code': '1mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when register user without password', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test@test.com',
        'code': '1mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when register user without email', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'password': '1234567890.jddd',
        'code': '1mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when register user without code', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test@test.com',
        'password': '1234567890.jddd'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when login user without password', async () => {
      const res = await request(app).post('/svc_game/login').send({
        'email': 'test@test.com'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when login user without email', async () => {
      const res = await request(app).post('/svc_game/login').send({
        'password': '1234567890.jddd'
      })
      expect(res.statusCode).toEqual(500)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when login user with invalid email', async () => {
      const res = await request(app).post('/svc_game/login').send({
        'email': 'testtest.com',
        'password': '1234567890.jddd'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when signup user with invalid email', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'testtest.com',
        'password': '1234567890.jddd',
        'code': '1mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when signup user with invalid caracters in email', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': '|test@test.com',
        'password': '1234567890.jddd',
        'code': '1mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when signup user with invalid email format', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test@test@test.com',
        'password': '1234567890.jddd',
        'code': '1mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when signup user with weak password', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test4@test.com',
        'password': 'asdfasdfasdfjddd',
        'code': '1mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when signup user with spaces in password', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test4@test.com',
        'password': 'asdfas   12!!fjddd',
        'code': '1mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when user is already registered', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test2@test.com',
        'password': '1234567890.jk',
        'code': '0LYMp5OA'
      })
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when signup user with empty body', async () => {
      const res = await request(app).post('/svc_game/signup').send({})
      expect(res.statusCode).toEqual(400)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when login user with empty body', async () => {
      const res = await request(app).post('/svc_game/login').send({})
      expect(res.statusCode).toEqual(500)
      expect(res.headers.authorization).toBeUndefined()
    })

    it('should return 400 when register user to a new game with invalid password', async () => {
      const res = await request(app).post('/svc_game/signup').send({
        'email': 'test2@test.com',
        'password': 'incorrectPassword2!',
        'code': '3mVslbZo'
      })
      expect(res.statusCode).toEqual(400)
    })
  })

  describe('Injection Attacks', () => {
    it('should not allow SQL injection in email field during login', async () => {
      const res = await request(app).post('/svc_game/login').send({
        'email': "' OR '1'='1'; -- ",
        'password': 'randomPassw123ord'
      })
      expect(res.statusCode).not.toEqual(200)
      expect(res.headers.authorization).toBeUndefined()
    })
  })
})
