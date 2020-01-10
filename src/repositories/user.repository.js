import models from '../models';
import UserCache from '../caches/user.cache';
import UserWrapper from '../wrappers/user.wrapper';

class UserRepository {
  constructor() {
    this.userCache = new UserCache();
  }

  async store(data) {
    const user = await models.User.create(data);
    await this.userCache.store(user);
    return UserWrapper.create(user);
  }

  async findAll() {
    const users = await models.User.findAll();
    return users.map(user => UserWrapper.create(user));
  }

  async findOne(uuid) {
    const user = await this.userCache.find(uuid) || await models.User.findOne({
      where: {
        uuid: Buffer.from(uuid, 'hex'),
      },
    });

    return UserWrapper.create(user);
  }

  async findById(id) {
    const user = await this.userCache.findById(id);

    if (!user) {
      user = await models.User.findByPk(id);
    }

    return UserWrapper.create(user);
  }

  async findByEmail(email) {
    let user = await this.userCache.findByEmail(email);

    if (!user) {
      user = await models.User.findOne({
        where: {
          email,
        },
      });
    }

    return UserWrapper.create(user);
  }
}

export default UserRepository;