const express = require('express');
const app  = express();
const fs = require('fs');
const watson = require('watson-developer-cloud');

//i18n settings
require('./config/i18n')(app);

// Bootstrap application settings
require('./config/express')(app);
// =-=-=-=-=-=-=-=-=-= Keys =-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Public key
const publicKey = fs.readFileSync('./keys/public.pub');
// Private Key
const privateKey = fs.readFileSync('./keys/private.pem');
// routes
require('./routes/routes')(app, watson,privateKey, publicKey);

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
