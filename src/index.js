require('dotenv').config();

import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import v1Route from './routes/v1';
import response from './utils/response'
import jwtMiddleware from './middleware/jwt.middleware';
import moment from 'moment';
import morgan from 'morgan';
import { stream, logger } from './configs/winston';

if (process.env.NODE_ENV === 'production') {
  const sentry = require('@sentry/node')
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  
  app.use(Sentry.Handlers.errorHandler());
}


const { getTasks, addTask, updateTask, removeTask } = require('./taskService');

const port = 3000;

const app = express();

app.use(morgan('combined', { stream }));
app.use(express.json());
app.use(cors());

app.use(jwtMiddleware);
app.use('/v1', v1Route);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  let apiError = err;

  if (!err.status) {
    apiError = createError(err);
  }

  if (process.env.NODE_ENV === 'test') {
    const errObj = {
      req: {
        headers: req.headers, 
        query: req.query, 
        body: req.body, 
        route: req.route, 
      }, 
      error: {
        message: apiError.message, 
        stack: apiError.stack, 
        status: apiError.status, 
      }, 
      user: req.user, 
    };

    logger.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}`, errObj);
  } else {
    res.locals.message = apiError.message;
    res.locals.error = apiError;
  }

  return response(res, {
    message: apiError.message,
  }, apiError.status);
});

app.get('/tasks', (req, res) => {
  res.send({
    tasks: getTasks(),
  });
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  addTask(title);
  res.send({});
});

app.patch('/tasks/:id', (req, res) => {
  const payload = req.body;
  updateTask(req.params.id, payload);
  res.send({});
});

app.delete('/tasks/:id', (req, res) => {
  removeTask(req.params.id);
  res.send({});
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}

export default app;