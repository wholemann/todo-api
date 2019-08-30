import httpStatus from 'http-status';
import createError from 'http-errors';
import _ from 'lodash';
import UserRepo from '../repositories/user.repository';


const get = async (req, res, next) => {
  try {
    const userRepo = new UserRepo();
    if (req.params.uuid) {
      const user = await userRepo.findOne(req.params.uuid);

      if (!user) {
        throw (createError(httpStatus.NOT_FOUND, 'Invalid email or password'));
      }
      res.json(_.pick(user, ['uuid', 'email', 'createdAt', 'updatedAt']));
    } else {
      const users = await userRepo.findAll();

      return res
        .json(users.map(user => _.pick(user, ['uuid', 'email', 'createdAt', 'updatedAt'])));
    }
  } catch (e) {
    next(e);
  }
};

export {
  get,
};
