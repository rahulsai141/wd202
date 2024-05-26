const { connect } = require('./connectDB.js');
const Todo = require('./TodoModel.js');

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: 'Second Item',
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created a todo with ID: ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

const countitems = async () => {
  try {
    const totalcount = await Todo.count();
    console.log(`Found ${totalcount} items in the table`);
  } catch (error) {
    console.log(error);
  }
};

const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll({
      where: {
        completed: false,
      },
      order: [['id', 'ASC']],
    });
    const todoList = todos.map(todo => todo.displayableString()).join('\n');
    console.log(todoList);
  } catch (error) {
    console.log(error);
  }
};

const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne({
      where: {
        completed: false,
      },
      order: [['id', 'DESC']],
    });
    console.log(todo.displayableString());
  } catch (error) {
    console.log(error);
  }
};

const updateItem = async id => {
  try {
    await Todo.update(
      { completed: true },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const deleteitem = async id => {
  try {
    const deleteRowCount = await Todo.destroy({
      where: {
        id: id,
      },
    });
    console.log(`Deleted row Count ${deleteRowCount} rows!`);
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  //await createTodo();
  //await countitems();
  await getAllTodos();
  //await getSingleTodo();
  await updateItem(4);
  await getAllTodos();
  await deleteitem(4);
  await getAllTodos();
})();
