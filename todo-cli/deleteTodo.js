var argv = require('minimist')(process.argv.slice(2));
const db = require('./models/index');
const deleteTodoItem = async id => {
  try {
    await db.Todo.deleteTodoItem(id);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  const { id } = argv;
  if (!id) {
    throw new Error('Need to pass an id');
  }
  if (!Number.isInteger(id)) {
    throw new Error('The id needs to be an integer');
  }
  await deleteTodoItem(id);
  await db.Todo.showList();
})();
