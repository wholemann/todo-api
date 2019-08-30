import createError from 'http-errors';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import UserRepo from '../repositories/user.repository';

export default async (req, res, next) => {
  try {
    req.user = null;

    if (req.headers.authorization) {
      let uuid;

      jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.JWT_SECRET,
        (err, payload) => {
          if (err) {
            return next(createError(httpStatus.UNAUTHORIZED, 'Access denied. No token provided.'));
          }

          uuid = payload.uuid;
        },
      );

      const userRepo = new UserRepo();
      const user = await userRepo.findOne(uuid);

      if (!user) {
        return next(createError(404, 'User not found.'));
      }

      req.user = user;
    }
    next();
  } catch (e) {
    next(e);
  }
};
