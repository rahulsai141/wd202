const express = require('express');
var csrf = require('tiny-csrf');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const saltRounds = 10;
app.use(bodyParser.json());

var cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser('shh! some secret string'));
//app.use(csrf({ cookie: true }));
app.use(csrf('qwertyuiopasdfghjklszxcvbnmqwert', ['POST', 'PUT', 'DELETE']));

app.use(
  session({
    secret: 'my-super-secret-key-21728172615261562',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, done) => {
      User.findOne({ where: { email: username, password: password } })
        .then(async user => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done('Invalid User');
          }
        })
        .catch(error => {
          return error;
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializable user in session', user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error, null);
    });
});

const { Todo, User } = require('./models');

app.set('view engine', 'ejs');

app.get('/', async (request, response) => {
  response.render('index', {
    title: 'Todo application',
    csrfToken: request.csrfToken(),
  });
});

app.get(
  '/todos',
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const allTodos = await Todo.getTodos();
    const overDueTodos = await Todo.overdue();
    const dueDateTodos = await Todo.dueToday();
    const dueLaterTodos = await Todo.dueLater();
    const completedTodos = await Todo.completedTodos();

    if (request.accepts('html')) {
      response.render('todo', {
        allTodos,
        overDueTodos,
        dueDateTodos,
        dueLaterTodos,
        completedTodos,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        allTodos,
        overDueTodos,
        dueDateTodos,
        dueLaterTodos,
        completedTodos,
      });
    }
  }
);

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

app.get('/signup', (request, response) => {
  response.render('signup', {
    title: 'Sign up',
    csrfToken: request.csrfToken(),
  });
});

app.get('/login', (request, response) => {
  response.render('login', {
    title: 'Login',
    csrfToken: request.csrfToken(),
  });
});

app.post(
  '/session',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (request, response) => {
    console.log(request.user);
    response.redirect('/todos');
  }
);

app.post('/users', async (request, response) => {
  //console.log('firstname', request.body.FirstName);
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  try {
    const user = await User.create({
      FirstName: request.body.FirstName,
      LastName: request.body.LastName,
      email: request.body.email,
      password: request.body.passowrd,
    });
    request.login(user, err => {
      if (err) {
        console.log(err);
      }
      response.redirect('/todos');
    });
  } catch (error) {
    console.log(error);
  }
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

app.put('/todos/:id', async (request, response) => {
  console.log('We have to update a todo with id:', request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    //const updatedTodo = await todo.markAsCompleted();
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
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

  // try {
  //   await Todo.remove(request.params.id);
  //   //return response.json({ success: true });
  //   return response.json(true);
  // } catch (error) {
  //   return response.status(422).json(error);
  // }
});

module.exports = app;
