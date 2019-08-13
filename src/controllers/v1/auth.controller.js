import httpStatus from 'http-status';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepo from '../../repositories/user.repository';
import response from '../../utils/response';

const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userRepo = new UserRepo();
    const user = await userRepo.findByEmail(email);

    if (!user) {
      return next(createError(httpStatus.BAD_REQUEST, 'Invalid email or password.'));
    }
    
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return next(createError(httpStatus.BAD_REQUEST, 'Invalid email or password.'));
    }

    const payload = {
      email: user.email,
      uuid: user.uuid,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });

    return response(res, { token });
  } catch (e) {
    next(e);
  }
}

const tokenTest = async (req, res, next) => {
  try {
    // return next(createError(500, 'test error!'));
    return response(res, req.user);
  } catch (e) {
    next(e);
  }
}

export {
  login,
  tokenTest,
};