module.exports = (app) => {
  const handyUtils = require('handyutils');
  const job=require('../models/jobProfile');
  /*
  * EMPLOYER
  */

  app.get('/signup', function(req, res) {
    const dataForView = {title:"Empleador", layout:"employer", message: req.flash()};
    res.render('signup', dataForView);
  });
  /*
  * EMPLOYER
  */
  app.get('/signin', function(req, res) {
    const dataForView = {title:"Empleador", layout:"employer", message: req.flash()};
    res.render('signin', dataForView);
  });
  app.get('/employer/dashboard', (req, res)=>{
    const dataForView = {title:"Empleador", layout:"employer", message: req.flash()};
    res.render('dashboard', dataForView);
  });

  app.get('/employer/addOffer', (req, res)=>{
    const dataForView = {title:"Agregar Oferta", layout:"employer", message: req.flash()};
    res.render('addOffer', dataForView);
  });

  app.post('/employer/addOffer/handler', (req, res) => {
    var arrayCommpetencies=req.body.competencies.split(",");
    var arrayCertificates=req.body.certificates.split(",");
var JSONFinalEmployer=
    {
      offerName:req.body.offerName,
      competencies:arrayCommpetencies,
      minExperience:req.body.minExperience,
      maxExperience:req.body.maxExperience,
      salary:req.body.salary,
      certificates:arrayCertificates
    };
    console.log('antes');
    console.log(JSONFinalEmployer);
    job.create(JSONFinalEmployer,(error,result)=>{
      console.log("llega");
      console.log(result);
      console.log(error);
    });

  });

}
