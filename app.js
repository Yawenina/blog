const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const routes = require('./routes');
const errorHandlers = require('./handlers/errorHandlers');
const helpers = require('./helpers');
require('./handlers/passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// validate user input
app.use(expressValidator());

// config passport
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),  
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// set app level variables
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.currentPath = req.path;
  next();
});

app.use('/', routes);

// handle 404 error
app.use(errorHandlers.notFound);

app.use(errorHandlers.flashValidationErrors);

// handle development error
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}

// handle production error
app.use(errorHandlers.productionErrors);

module.exports = app;
