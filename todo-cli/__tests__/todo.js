const todoList = require('../todo');
const { all, markAsComplete, add } = todoList();

describe('First test suite', () => {
  beforeAll(() => {
    add({
      title: 'Test todo',
      completed: false,
      dueDate: new Date().toLocaleDateString('en-CA'),
    });
  });
  test('Should add new todo', () => {
    const todoitems = all.length;

    add({
      title: 'Test todo',
      completed: false,
      dueDate: new Date().toLocaleDateString('en-CA'),
    });
    expect(all.length).toBe(todoitems + 1);
  });

  test('Should mark as complete', () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
});
