require('dotenv').config();

import createError from 'http-errors';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
import v1Route from './routes/v1';

const { getTasks, addTask, updateTask, removeTask } = require('./taskService');


const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());
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

  res.locals.message = apiError.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? apiError : {};

  return res.status(apiError.status)
    .json({ message: apiError.message });
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