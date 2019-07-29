const { getTasks, getTask, addTask, updateTask, removeTask, clearTasks } = require('./taskService');

beforeEach(() => {
});

afterEach(() => {
  clearTasks();
});


test('getTasks', () => {
  addTask('test1');
  addTask('test2');

  expect(getTasks().length).toBe(2);
});

test('getTask', () => {
  addTask('test1');

  const tasks = getTasks();
  const { id } = tasks[0];

  expect(getTask(id)).toEqual({id, title: 'test1', status: 'TODO'});
});

test('addTask', () => {
  addTask('test1');
  addTask('test2');
  
  const tasks = getTasks();

  expect(tasks.length).toBe(2);
  expect(tasks[0].title).toBe('test1');
  expect(tasks[1].title).toBe('test2');
});

test('updateTask', () => {
  addTask('test1');

  const tasks = getTasks();
  const { id } = tasks[0];

  updateTask(id, { title: 'updated' });
  
  expect(getTask(id).title).toBe('updated');
  
  updateTask(id, { status: 'DONE' });
  expect(getTask(id).status).toBe('DONE');
  
  updateTask(id, { title: 'updated', status: 'DONE' });
  expect(getTask(id)).toEqual({id, title: 'updated', status: 'DONE' });
});

test('removeTask', () => {
  addTask('test1');
  addTask('test2');

  const tasks = getTasks();
  const { id } = tasks[0];

  removeTask(id);

  expect(getTask(id)).toBeUndefined();

});

test('clearTask', () => {
  addTask('test3');

  clearTasks();

  const tasks = getTasks();

  expect(tasks.length).toBe(0);
})

