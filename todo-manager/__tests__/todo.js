// const request = require('supertest');

// const db = require('../models/index');
// const app = require('../app');

// let server, agent;

// describe('Todo server suite', () => {
//   beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//     server = app.listen(3000, () => {});
//     agent = request.agent(server);
//   });

//   afterAll(async () => {
//     await db.sequelize.close();
//     server.close();
//   });

//   test('First Test case', async () => {
//     const response = await agent.post('/todos').send({
//       title: 'Buy milk',
//       dueDate: new Date().toISOString(),
//       completed: false,
//     });

//     expect(response.statusCode).toBe(200);
//     expect(response.header['content-type']).toBe(
//       'application/json; charset=utf-8'
//     );
//     const parsedResponse = JSON.parse(response.text);
//     expect(parsedResponse.id).toBeDefined();
//   });
// });

const request = require('supertest');
var cheerio = require('cheerio');
const db = require('../models/index');
const app = require('../app');

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
}

describe('Todo Application', function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test('Creates a todo and responds with json at /todos POST endpoint', async () => {
    const res = await agent.get('/');
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post('/todos').send({
      title: 'Buy milk',
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
    // expect(response.header['content-type']).toBe(
    //   'application/json; charset=utf-8'
    // );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();
  });

  test('Marks a todo with the given ID as complete', async () => {
    let res = await agent.get('/');
    let csrfToken = extractCsrfToken(res);
    await agent.post('/todos').send({
      title: 'Buy milk',
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get('/')
      .set('Accept', 'application/json');
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueDateTodos.length;
    const latestTodo = parsedGroupedResponse.dueDateTodos[dueTodayCount - 1];

    res = await agent.get('/');
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
      });
    // const parsedResponse = JSON.parse(response.text);
    // const todoID = parsedResponse.id;

    // expect(parsedResponse.completed).toBe(false);

    // const markCompleteResponse = await agent
    //   .put(`/todos/${todoID}/markASCompleted`)
    //   .send();
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  test('Fetches all todos in the database using /todos endpoint', async () => {
    let response = await agent.get('/todos');
    const parsedResponsebefore = JSON.parse(response.text);
    let res = await agent.get('/');
    let csrfToken = extractCsrfToken(res);
    await agent.post('/todos').send({
      title: 'Buy xbox',
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    await agent.post('/todos').send({
      title: 'Buy ps3',
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    response = await agent.get('/todos');
    const parsedResponseafter = JSON.parse(response.text);

    console.log(parsedResponseafter.length);
    //expect(parsedResponse.length).toBe(4);
    expect(parsedResponseafter.length).toBe(parsedResponsebefore.length + 2);
    //expect(parsedResponse[3]['title']).toBe('Buy ps3');
  });

  test('Deletes a todo with the given ID if it exists and sends a boolean response', async () => {
    let res = await agent.get('/');
    let csrfToken = extractCsrfToken(res);
    await agent.post('/todos').send({
      title: 'Buy box',
      dueDate: new Date().toISOString('en-CA'),
      completed: false,
      _csrf: csrfToken,
    });
    const response = await agent.get('/todos');
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse[parsedResponse.length - 1].id;

    //expect(parsedResponse.length).toBe(5);
    const deleteItem = await agent
      .delete(`/todos/${todoID}`)
      .send({ _csrf: csrfToken });
    const UpdatedParsedResponse = JSON.parse(deleteItem.text);
    expect(UpdatedParsedResponse).toBe(true);
    // const deleteItem1 = await agent.delete(`/todos/${todoID}`);
    // const UpdatedParsedResponse1 = JSON.parse(deleteItem1.text);
    // expect(UpdatedParsedResponse1).toBe(false);
  });
});
