import models from '../models';

export default {
  // CREATE
  store: async (data) => await models.User.create(data),

  // READ
  findById: async (id) => await models.User.findByPk(id),

  findOne: async (uuid) =>  await models.User.findOne({ where: { uuid: Buffer.from(uuid, 'hex') } }),

  findAll: async () => await models.User.findAll(),
}
