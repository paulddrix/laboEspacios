module.exports = (app) => {
  const handyUtils = require('handyutils');
  const job =require('../models/jobProfile');
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
    console.log('fuckingshit');
    const dataForView = {title:"Empleador", layout:"employer", message: req.flash()};
    job.find({ }, (error, result) =>{
      handyUtils.debug('result101 at /employer/dashboard', result);
      dataForView.offerList = result;
      res.render('dashboard', dataForView);
    });
  });

  app.get('/employer/addOffer', (req, res)=>{
    handyUtils.debug('decodedInfo at /employer/addOffer/handler', req.body.decodedInfo);
    const dataForView = {title:"Agregar Oferta", layout:"employer", message: req.flash()};
    dataForView.companyId = req.body.decodedInfo.userId ;
    res.render('addOffer', dataForView);
  });

  app.post('/employer/addOffer/handler', (req, res) => {
    handyUtils.debug('req at /employer/addOffer/handler', req);
    //handyUtils.debug('req at /employer/addOffer/handler', req);
    var arrayCommpetencies=req.body.competencies.split(",");
    var arrayCertificates=req.body.certificates.split(",");
    var JSONFinalEmployer=
    {
      companyOwner: req.body.companyId,
      offerName:req.body.offerName,
      competencies:arrayCommpetencies,
      minExperience:req.body.minExperience,
      maxExperience:req.body.maxExperience,
      salary:req.body.salary,
      certificates:arrayCertificates
    };
    handyUtils.debug('json /employer/addOffer/handler', JSONFinalEmployer);
    job.create(JSONFinalEmployer,(error,result)=>{
      console.log(result);
      console.log(error);
      const successMessage = 'La oferta de empleo ha sido creada on exito.';
      req.flash('success', successMessage);
      res.redirect('/employer/dashboard');
    });
  });

}
