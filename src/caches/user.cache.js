import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis);

class UserCache {
  constructor() {
    this.client = redis.createClient();
    this.client.on('connect', () => {
      bluebird.promisifyAll(this.client);
    });
    this.client.on('error', (e) => {
      console.error(`redis error : ${e}`);
    });
  }

  async store(user) {
    try {
      await this.client.hsetAsync('users:id', [user.id, user.uuid]);
      await this.client.hsetAsync('users:email', [user.email, user.uuid]);
      await this.client.hsetAsync('users:uuid', [user.uuid, JSON.stringify(user.toJSON())]);
    } catch (e) {
      console.log(e);
    }
  }

  async find(uuid) {
    if (uuid) {
      try {
        return await this.client.hgetAsync('users:uuid', uuid);
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }

  async findById(id) {
    if (id) {
      try {
        const uuid = await this.client.hgetAsync('users:id', id);
        return this.find(uuid);
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }

  async findByEmail(email) {
    if (email) {
      try {
        const uuid = await this.client.hgetAsync('users:email', email);
        return this.find(uuid);
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
}

export default UserCache;
