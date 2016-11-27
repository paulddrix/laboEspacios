module.exports = (app, watson) => {
  const async = require('async');
  const fs = require('fs');
  const i18n  = require('i18next');
  let PDFParser = require("pdf2json");

  let pdfParser = new PDFParser(this,1);

  app.get('/testPerson', (req, res)=>{
    var textoCandidato = '';
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

      pdfParser.loadPDF("./testingLONG.pdf");

      fs.readFile("./testingPDF/resume.content.txt", 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: parsed');
        textoCandidato = data;
        console.log('checking ----------__@_@#_$#_#___');
        console.log(textoCandidato);
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
        text: textoCandidato,
        consumption_preferences: true,
        raw_scores: true,
        headers: {
          'accept-language': 'es',
          'accept': 'application/json'
        }
      };
      personality_insights.profile(params, function(error, response) {
        if (error)
          console.log('error:', error);
        else
          console.log(JSON.stringify(response, null, 2));
      });
    }
   ]);

  });

}
