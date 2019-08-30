import express from 'express';
import { login, signUp, tokenTest } from '../controllers/auth.controller';
import validator from '../middleware/validator';
import models from '../models';

const router = express.Router();

router.route('/login')
  .post(validator(models.User.validate),
    login,
  );

router.route('/signUp')
  .post(validator(models.User.validate),
    signUp,
  );

router.route('/tokenTest')
  .get(
    tokenTest,
  );

export default router;
