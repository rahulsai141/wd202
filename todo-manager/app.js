const express = require('express');

const app = express();
const { Todo } = require('./models');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.json(todo);
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
  try {
    if (todo === null) {
      return response.json(false);
    } else {
      const deletedTodo = await todo.deletetodo();
      return response.json(true);
    }
  } catch (error) {
    return response.status(422).json(error);
  }
  //response;
});

module.exports = app;
