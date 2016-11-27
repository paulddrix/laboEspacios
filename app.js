const express = require('express');
const app  = express();
const watson = require('watson-developer-cloud');
const extend = require('util')._extend;

//i18n settings
require('./config/i18n')(app);

// Bootstrap application settings
require('./config/express')(app);

require('./routes/routes')(app, watson);

// error-handler settings
require('./config/error-handler')(app);

// Stores all user inputs
app.locals.dataForPersonalityTest = "";

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
