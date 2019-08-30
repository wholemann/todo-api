import httpStatus from 'http-status';
import createError from 'http-errors';
import UserRepo from '../repositories/user.repository';
import AuthService from '../services/auth.service';
import response from '../utils/response';

const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { password } = req.body;

    const userRepo = new UserRepo();
    const authService = new AuthService(userRepo);
    const token = await authService.login(email, password);

    return response(res, { token });
  } catch (e) {
    return next(createError(httpStatus.BAD_REQUEST));
  }
};

const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { password } = req.body;

    const userRepo = new UserRepo();
    const authService = new AuthService(userRepo);
    const { token, userRecord } = await authService.signUp(email, password);

    return response(res, { token, userRecord }, httpStatus.CREATED);
  } catch (e) {
    return next(createError(httpStatus.BAD_REQUEST, e.message));
  }
};

const tokenTest = async (req, res, next) => {
  try {
    return response(res, req.user);
  } catch (e) {
    next(e);
  }
};

export {
  login,
  signUp,
  tokenTest,
};
