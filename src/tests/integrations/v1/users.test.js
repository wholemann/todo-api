import request from 'supertest';
import randomString from 'random-string';
import { uuid } from '../../../utils/uuid';
import models from '../../../models';
import app from '../../../index';

let user;

beforeAll(async () => {
  await models.User.create({
    email: randomString() + '@test.com', 
    password: randomString(),
  });

  user = await models.User.create({
    email: randomString() + '@test.com', 
    password: randomString(),
  });
});

afterAll(async () => {
  await models.User.destroy({ truncate: true });
  await models.sequelize.close();
});

describe('users', () => {
  describe('GET /v1/users', () => {
    it('responds with 200', async () => {
      const response = await request(app)
        .get('/v1/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.length).toBe(2);
    });

    it('responds with 200 if valid uuid is passed', async () => {
      const response = await request(app)
        .get(`/v1/users/${user.uuid}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      console.log(response.body);
      expect(response.body.email).toBe(user.email);
    });

    it('responds with 404 if invalid uuid is passed', async () => {
      const response = await request(app)
        .get(`/v1/users/${uuid()}`)
        .send('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
})