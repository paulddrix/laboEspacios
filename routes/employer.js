module.exports = (app) => {
  const handyUtils = require('handyutils');
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

  app.post('/employer/registerOffer', (req, res) => {
    
  });

}
