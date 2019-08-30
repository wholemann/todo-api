const uuidv4 = require('uuid/v4');
const Storage = require('node-storage');


const dbName = './data/tasks.json';
const store = new Storage(dbName);


const generateId = () => uuidv4();

const getTasks = () => store.get('tasks') || [];

const getTask = (id) => {
  const tasks = store.get('tasks');

  return tasks.find(v => v.id === id);
};

const addTask = (title) => {
  const tasks = getTasks();
  const id = generateId();
  store.put('tasks', [
    ...tasks,
    {
      id,
      title,
      status: 'TODO',
    },
  ]);
  return store.get('tasks');
};

const updateTask = (id, obj) => {
  const tasks = getTasks();
  const keys = Object.keys(obj);

  const task = tasks.find(v => v.id === id);

  keys.forEach(v => task[v] = obj[v]);

  const index = tasks.findIndex(v => v.id === id);
  tasks[index] = task;

  store.put('tasks', tasks);
};

const removeTask = (id) => {
  const tasks = getTasks();
  const index = tasks.findIndex(v => v.id === id);
  tasks.splice(index, 1);

  store.put('tasks', tasks);
};

const clearTasks = async () => {
  store.put('tasks', []);
};

module.exports = {
  getTasks,
  getTask,
  addTask,
  updateTask,
  removeTask,
  clearTasks,
};
