const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config passport
app.use(session({
  secret: process.env.SECRET,
  resave: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// set app level variables
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use('/', routes);

// handle 404 error
app.use(errorHandlers.notFound);

// handle development error
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}

// handle production error
app.use(errorHandlers.productionErrors);

module.exports = app;
