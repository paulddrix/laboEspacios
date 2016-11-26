// Module dependencies
const express = require('express');
const bodyParser  = require('body-parser');
const exphbs = require('express-handlebars');

module.exports = function (app) {
  app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');
  app.enable('trust proxy');

  // Configure Express
  app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(express.static(__dirname + '/../public'));

  // Only loaded when SECURE_EXPRESS is `true`
  if (process.env.SECURE_EXPRESS)
    require('./security')(app);

};
