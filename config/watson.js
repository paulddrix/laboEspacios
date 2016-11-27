module.exports = function (app, watson) {
  const watson = require('watson-developer-cloud');
  const extend = require('util')._extend;
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
};
