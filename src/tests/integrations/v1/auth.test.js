import request from 'supertest';
import randomString from 'random-string';
import models from '../../../models';
import UserRepo from '../../../repositories/user.repository';
import jwt from 'jsonwebtoken';

import app from '../../../index';


afterAll(() => {
  models.sequelize.close();
})

describe('auth', () => {
  
  let userData;
  let token;
  const userRepo = new UserRepo();

  beforeAll(async () => {
    userData = {
      email: randomString() + '@test.com',
      password: randomString(), 
    }

    await userRepo.store(userData);
  });

  describe('GET /v1/auth', () => {
    it('responds with 200 if valid email and password is passed', async () => {
      const response = await request(app)
      .post('/v1/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect('Content-Type', /json/)
      
      token = response.body.data.token;
      
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      expect(userData.email).toBe(payload.email);

      const user = await userRepo.findOne(payload.uuid);
      expect(user.email).toBe(user.email);
    });

    it('responds with 200 if valid token is passed', async () => {
      const response = await request(app)
        .get('/v1/auth/tokenTest')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      console.log(response.body);
      expect(response.body.data.email).toBe(userData.email);
    });

    it('responds with 400 if user is not registered', async () => {
      const response = await request(app)
        .post('/v1/auth/login')
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
        .post('/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: userData.email,
          password: 'invalidPW',
        })
        .expect('Content-Type', /json/)
        .expect(400);
    });
  })
});
