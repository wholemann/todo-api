import request from 'supertest';
import randomString from 'random-string';
import jwt from 'jsonwebtoken';
import models from '../../models';
import UserRepo from '../../repositories/user.repository';

import app from '../../index';


afterAll(() => {
  models.sequelize.close();
});

describe('auth', () => {

  const userRepo = new UserRepo();

  describe('GET /auth', () => {
    let userData;
    let token;

    beforeAll(async () => {
      userData = {
        email: `${randomString()}@test.com`,
        password: randomString(),
      };

      await userRepo.store(userData);
    });

    it('responds with 200 if valid email and password is passed', async () => {
      const response = await request(app)
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect('Content-Type', /json/);

      token = response.body.data.token;

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      expect(userData.email).toBe(payload.email);

      const user = await userRepo.findOne(payload.uuid);
      expect(user.email).toBe(user.email);
    });

    it('responds with 200 if valid token is passed', async () => {
      const response = await request(app)
        .get('/auth/tokenTest')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(response.body.data.email).toBe(userData.email);
    });

    it('responds with 400 if user is not registered', async () => {
      const response = await request(app)
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: 'NoUser@test.com',
          password: userData.password,
        })
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('responds with 400 if invalid password is passed', async () => {
      const response = await request(app)
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: userData.email,
          password: 'invalidPW',
        })
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });

  describe('POST /auth', () => {

    let userData;

    beforeAll(async () => {
      userData = {
        email: `${randomString()}@test.com`,
        password: randomString(),
      };

      await userRepo.store(userData);
    });

    it('responds with 201 if valid email and password is passed', async () => {
      const response = await request(app)
        .post('/auth/signUp')
        .set('Accept', 'application/json')
        .send({
          email: `${randomString()}@test.com`,
          password: randomString(),
        })
        .expect('Content-Type', /json/)
        .expect(201);
    });

    it('responds with 400 if email already registered', async () => {
      const response = await request(app)
        .post('/auth/signUp')
        .set('Accept', 'application/json')
        .send({
          email: userData.email,
          password: randomString(), 
        })
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('responds with 400 if email is not provided', async () => {
      const response = await request(app)
        .post('/auth/signUp')
        .set('Accept', 'application/json')
        .send({
          email: '',
          password: randomString(),
        })
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('responds with 400 if password is not provided', async () => {
      const response = await request(app)
        .post('/auth/signUp')
        .set('Accept', 'application/json')
        .send({
          email: `${randomString()}@test.com`,
          password: '',
        })
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });
});
// POST /v1/auth/signUp {email, password}

// Return 201 if valid request
// Return 400 if email already registered
// Return 400 if email is not provided
// Return 400 if password is not provided


// POST /api/returns {customerId, movieId}

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental