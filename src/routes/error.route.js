import express from 'express';

const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    next(new Error('Sentry Test Error Occur!'));
  });

export default router;
