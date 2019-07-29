const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { getTasks, addTask, updateTask, removeTask } = require('./taskService');


const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

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

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
