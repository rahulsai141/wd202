const todoList = require('../todo');

const formattedDate = d => {
  return d.toISOString().split('T')[0];
};
const { all, markAsComplete, add, overdue, dueLater, dueToday } = todoList();

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

  test('Retrieval of due today items', () => {
    const duetodayitems = dueToday().length;
    add({
      title: 'Test todo',
      completed: false,
      dueDate: formattedDate(new Date()),
    });
    expect(dueToday().length).toBe(duetodayitems + 1);
  });

  test('Retrieval of overdue items', () => {
    const overdueitems = overdue().length;
    add({
      title: 'Test todo',
      completed: false,
      dueDate: formattedDate(
        new Date(new Date().setDate(dateToday.getDate() - 1))
      ),
    });
    expect(overdue().length).toBe(overdueitems + 1);
  });

  test('Retrieval of due Later items', () => {
    const duelateritems = dueLater().length;
    add({
      title: 'Test todo',
      completed: false,
      dueDate: formattedDate(
        new Date(new Date().setDate(dateToday.getDate() + 1))
      ),
    });
    expect(dueLater().length).toBe(duelateritems + 1);
  });
});
