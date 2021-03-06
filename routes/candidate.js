module.exports = (app, watson) => {
  const handyUtils = require('handyutils');
  const multer  = require('multer');
  const upload = multer({ dest: 'uploads/' });
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
  // start candidate journey
  app.get('/candidate/index', (req, res)=>{
    const data = {'title':'ChaTitulo','layout':'candidateChat', message:req.flash()};
    res.render('candidateIndex', data);
  });
  // start candidate chat
  app.get('/candidate/chat', (req, res)=>{
    const data = {'title':'ChaTitulo','layout':'candidateChat', message:req.flash()};
    res.render('candidateChatBody', data);
  });
  // start questions
  app.get('/candidate/questions', (req, res)=>{
    const data = {'title':'ChaTitulo','layout':'candidateChat', message:req.flash()};
    res.render('candidateQuestions', data);
  });
  // start resume upload
  app.get('/candidate/upload', (req, res)=>{
    const data = {'title':'ChaTitulo','layout':'candidateChat', message:req.flash()};
    res.render('candidateUpload', data);
  });
  const async = require('async');
  const fs = require('fs');
  const i18n  = require('i18next');
  let PDFParser = require("pdf2json");

  let pdfParser = new PDFParser(this,1);
  // start resume upload handler
  app.post('/candidate/upload/handler', upload.single('resume'),(req, res, next)=>{
    handyUtils.debug('pdf file',req.file);
    const data = {'title':'ChaTitulo','layout':'candidateChat', message:req.flash()};
    var resumeCandidate = '';
    async.series([
      // handle pdf upload
    (next) => {
      console.log('first serie');
      next();
     },
     // parse pdf file
    (next) => {
      pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
      pdfParser.on("pdfParser_dataReady", pdfData => {
          fs.writeFile("./testingPDF/resume.content.txt", pdfParser.getRawTextContent());
      });

      pdfParser.loadPDF("../uploads/"+req.file.filename);

      fs.readFile("./testingPDF/resume.content.txt", 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: parsed');
        resumeCandidate = data;
        console.log('checking ----------__@_@#_$#_#___');
        console.log(resumeCandidate);
        next();
      });
    },
    (next) =>{
      // Create the service wrapper
      var personality_insights = watson.personality_insights({
        version: 'v2',
        username: '5e53bade-d01f-4beb-bcf6-de1dbf8186f8',
        password: '4YwXuTIuUqmu'
      });

      var params = {
        // Get the content items from the JSON file.
        text: resumeCandidate,
        consumption_preferences: true,
        raw_scores: true,
        headers: {
          'accept-language': 'en',
          'accept': 'application/json'
        }
      };
      personality_insights.profile(params, function(error, response) {
        if (error)
          console.log('error:', error);
        else
          console.log(JSON.stringify(response, null, 2));
          let personalityInsightsRes = JSON.stringify(response, null, 2);
          console.log('parsing json!!!!');
          console.log(response.tree.children[0].children[0].children[1].children[5]);

      });
    }
   ]);
    res.redirect('/candidate/offers');
  });
  // final stage in candidate journey
  app.get('/candidate/offers', (req, res)=>{
    const dataForView = {'title':'ChaTitulo','layout':'candidateChat', message:req.flash()};
    res.render('candidateOffers', dataForView);
  });
  // final stage in candidate journey
  app.get('/candidate/report', (req, res)=>{
    const data = {'title':'ChaTitulo','layout':'candidateChat', 'candidate':'pedro'};
    res.render('candidateReport', data);
  });
  // Endpoint to be call from the client side
  app.post('/api/message', function(req, res) {
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
      app.locals.inputWordsCount += payload.input.text.split(' ').length;
    }

    // Send the input to the conversation service
    conversation.message( payload, function(err, data) {
      handyUtils.debug('user input',payload.input.text);
      if ( err ) {
        return res.status( err.code || 500 ).json( err );
      }
      else {
        console.log('el usuario no ha aceptado');
        return res.json( updateMessage( payload, data ) );
      }
    });
    /**
     * Updates the response text using the intent confidence
     * @param  {Object} input The request to the Conversation service
     * @param  {Object} response The response from the Conversation service
     * @return {Object}          The response with the updated message
     */
    function updateMessage(input, response) {
      //console.log(response['output']['text'].find("mandarhojadevida941"));

      for (i = 0; i < response['output']['text'].length; i++) {
        if ( response['output']['text'][i] == 'mandarhojadevida941') {
          app.locals.textoSalidaEncontrado = true;

        }
      }

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
  } );



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
