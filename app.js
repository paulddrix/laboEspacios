const express = require('express');
const app  = express();
const watson = require('watson-developer-cloud');
const extend = require('util')._extend;

//i18n settings
require('./config/i18n')(app);

// Bootstrap application settings
require('./config/express')(app);

// Create the service wrapper
var personalityInsights = watson.personality_insights({
  version: 'v2',
  username: '5e53bade-d01f-4beb-bcf6-de1dbf8186f8',
  password: '4YwXuTIuUqmu'
});
var conversation = watson.conversation({
   version: 'v1',
   version_date: '2016-09-20',
   username: '54a07256-2385-48fb-9add-5be941734f97',
   password: 'ZX31F0bGaLGo'
});
require('./routes/routes')(app);

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);