module.exports = (app, watson) => {
  var conversation = watson.conversation({
     version: 'v1',
     version_date: '2016-09-20',
     url: "https://gateway.watsonplatform.net/conversation/api",
     username: '54a07256-2385-48fb-9add-5be941734f97',
     password: 'ZX31F0bGaLGo'
  });
  // Replace with the context obtained from the initial request
  var context = {};

  // Exit condition for candidate
  var palabrasCompletas = false;

  app.get('/candidate', (req, res)=>{
    const data = {'title':'ChaTitulo','layout':'candidateChat', 'candidate':'pedro'};
    res.render('candidateChatBody', data);
  });

  // Endpoint to be call from the client side
  app.post( '/api/message', function(req, res) {
    var workspace = process.env.WORKSPACE_ID || 'e31d19f8-8401-4a2f-87a9-42618c14d017';
    if ( !workspace || workspace === '<workspace-id>' ) {
      return res.json( {
        'output': {
          'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' +
          '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' +
          'Once a workspace has been defined the intents may be imported from ' +
          '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
        }
      } );
    }
    var payload = {
      workspace_id: workspace,
      context: {},
      input: {}
    };
    if ( req.body ) {
      if ( req.body.input ) {
        payload.input = req.body.input;
      }
      if ( req.body.context ) {
        // The client must maintain context/state
        payload.context = req.body.context;
      }
    }

    // Add user input to data for personality test
    if ( payload['input']['text'] !== undefined ) {
      app.locals.dataForPersonalityTest += payload['input']['text'] + '. ';
      app.locals.inputWordsCount += payload['input']['text'].split(' ').length;
      console.log(app.locals.dataForPersonalityTest);
    }

    // Add user input to data for personality test
    if ( payload['input']['text'] == "1200" || app.locals.inputWordsCount >= 1200 ) {
      palabrasCompletas = true;
    }

    if( palabrasCompletas ) {
      payload['input']['text'] = "salidachat#salgase";
    }

    // Send the input to the conversation service
    conversation.message( payload, function(err, data) {
      if ( err ) {
        return res.status( err.code || 500 ).json( err );
      }
      return res.json( updateMessage( payload, data ) );
    } );

  } );

  /**
   * Updates the response text using the intent confidence
   * @param  {Object} input The request to the Conversation service
   * @param  {Object} response The response from the Conversation service
   * @return {Object}          The response with the updated message
   */
  function updateMessage(input, response) {
    var responseText = null;
    var id = null;
    if ( !response.output ) {
      response.output = {};
    } else {
      return response;
    }
    if ( response.intents && response.intents[0] ) {
      var intent = response.intents[0];
      // Depending on the confidence of the response the app can return different messages.
      // The confidence will vary depending on how well the system is trained. The service will always try to assign
      // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
      // user's intent . In these cases it is usually best to return a disambiguation message
      // ('I did not understand your intent, please rephrase your question', etc..)
      if ( intent.confidence >= 0.75 ) {
        responseText = 'I understood your intent was ' + intent.intent;
      } else if ( intent.confidence >= 0.5 ) {
        responseText = 'I think your intent was ' + intent.intent;
      } else {
        responseText = 'I did not understand your intent';
      }
    }
    response.output.text = responseText;

    return response;
  }

    //
    // // Endpoint which allows deletion of db
    // app.post( '/clearDb', auth, function(req, res) {
    //   nano.db.destroy( 'car_logs', function() {
    //     nano.db.create( 'car_logs', function() {
    //       logs = nano.db.use( 'car_logs' );
    //     } );
    //   } );
    //   return res.json( {'message': 'Clearing db'} );
    // } );
}
