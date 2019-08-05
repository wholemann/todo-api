import randomString from 'random-string';
import { uuid } from '../../../utils/uuid';
import models from '../../../models';

afterAll(async () => {
  await models.User.destroy({ truncate: true });
  await models.sequelize.close();
});

test('Generate ordered UUID', () => {
  const orderedUUID = uuid();

  expect(orderedUUID).toMatch(/\b4[0-9A-Fa-f]{31}\b/g);
});

test('If you create user then create a valid uuid', async () => {
  const user = await models.User.create({
    email: `${randomString()}@test.com`, 
    password: randomString(), 
  });

  expect(user.uuid).toMatch(/\b4[0-9A-Fa-f]{31}\b/g);
});