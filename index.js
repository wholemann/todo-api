const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Storage = require('node-storage');
const uuidv4 = require('uuid/v4');

const store = new Storage('./data/tasks.json');

const port = 3000;


const getTasks = () => store.get('tasks') || [];

const generateId = () => uuidv4();

const addTask = ({ title }) => {
  const tasks = getTasks();
  tasks.push({
    id: generateId(),
    title,
    status: 'todo',
  });
  store.put('tasks', tasks);
};

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/tasks', (req, res) => {
  res.send({
    tasks: getTasks(),
  });
});

app.post('/tasks', (req, res) => {
  const { task } = req.body;
  addTask(task);
  res.send({});
});

app.patch('/tasks/:id', (req, res) => {
  // deleteTask(req.params.id);
  res.send({});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
