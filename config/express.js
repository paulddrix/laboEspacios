// Module dependencies
const express = require('express');
const bodyParser  = require('body-parser');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const fs = require('fs');
// session storage with mongodb
const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'userSessions',
});

module.exports = function (app) {
  app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');
  app.enable('trust proxy');

  // Configure Express
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(express.static(__dirname + '/../public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({ secret: 'laboEspacios',
  resave: false, saveUninitialized: false,
  maxAge: 9000000, cookie: { secure: false }, store: sessionStore }));
  app.use(flash());
  app.use(cookieParser('laboEspacios'));

  // Only loaded when SECURE_EXPRESS is `true`
  if (process.env.SECURE_EXPRESS)
    require('./security')(app);

};
