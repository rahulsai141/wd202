const express = require('express');
const path = require('path');
const app = express();
const { Todo } = require('./models');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', async (request, response) => {
  const allTodos = await Todo.getTodos();
  const overDueTodos = await Todo.overdue();
  const dueDateTodos = await Todo.dueToday();
  const dueLaterTodos = await Todo.dueLater();

  if (request.accepts('html')) {
    response.render('index', {
      allTodos,
      overDueTodos,
      dueDateTodos,
      dueLaterTodos,
    });
  } else {
    response.json({
      allTodos,
      overDueTodos,
      dueDateTodos,
      dueLaterTodos,
    });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/todos', async (request, response) => {
  try {
    const todos = await Todo.findAll({
      order: [['id', 'ASC']],
    });
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
  //response.send('Todo-list');
});

app.post('/todos', async (request, response) => {
  //response.send('Create a Todo', request.body);

  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    //return response.json(todo);
    return response.redirect('/');
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put('/todos/:id/markAsCompleted', async (request, response) => {
  console.log('We have to update a todo with id:', request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete('/todos/:id', async (request, response) => {
  console.log('We are Deleting an id based on the id: ', request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  // try {
  //   if (todo === null) {
  //     return response.json(false);
  //   } else {
  //     const deletedTodo = await todo.deletetodo();
  //     return response.json(true);
  //   }
  // } catch (error) {
  //   return response.status(422).json(error);
  // }
  //response;

  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;
