module.exports = (app) => {
  const handyUtils = require('handyutils');
  /*
  * EMPLOYER
  */
  app.get('/signup', function(req, res) {
    const dataForView = {title:"Empleador", layout:"employer"};
    res.render('signup', dataForView);
  });
  /*
  * EMPLOYER
  */
  app.get('/signin', function(req, res) {
    const dataForView = {title:"Empleador", layout:"employer"};
    res.render('signin', dataForView);
  });
  app.get('/employer/dashboard', (req, res)=>{
    const dataForView = {title:"Empleador", layout:"employer"};
    res.render('dashboard', dataForView);
  });


}
