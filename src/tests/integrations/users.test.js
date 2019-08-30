import request from 'supertest';
import randomString from 'random-string';
import { uuid } from '../../utils/uuid';
import models from '../../models';
import UserRepo from '../../repositories/user.repository';

import app from '../../index';

let userRepo;
let user;

beforeAll(async () => {
  await models.User.destroy({ truncate: true });

  userRepo = new UserRepo();

  await userRepo.store({
    email: `${randomString()}@test.com`,
    password: randomString(),
  });

  user = await userRepo.store({
    email: `${randomString()}@test.com`,
    password: randomString(),
  });
});

afterAll(async () => {
  await models.sequelize.close();
});

describe('users', () => {
  describe('GET /users', () => {
    it('responds with 200', async () => {
      const response = await request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.length).toBe(2);
    });

    it('responds with 200 if valid uuid is passed', async () => {
      const response = await request(app)
        .get(`/users/${user.uuid}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.email).toBe(user.email);
    });

    it('responds with 404 if invalid uuid is passed', async () => {
      const response = await request(app)
        .get(`/users/${uuid()}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
});
