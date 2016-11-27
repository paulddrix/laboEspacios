module.exports = (app, watson) => {
  const i18n  = require('i18next');

  var textoCandidato = "we";

  // Create the service wrapper
  var personality_insights = watson.personality_insights({
    version: 'v2',
    username: '5e53bade-d01f-4beb-bcf6-de1dbf8186f8',
    password: '4YwXuTIuUqmu'
  });

  var params = {
    // Get the content items from the JSON file.
    text: textoCandidato,
    consumption_preferences: true,
    raw_scores: true,
    headers: {
      'accept-language': 'en',
      'accept': 'application/json'
    }
  };

  app.get('/testPerson', (req, res)=>{
    personality_insights.profile(params, function(error, response) {
      if (error)
        console.log('error:', error);
        else
        console.log(JSON.stringify(response, null, 2));
      });
  });

}
