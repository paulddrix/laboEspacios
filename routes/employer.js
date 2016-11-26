module.exports = (app) => {
  const i18n  = require('i18next');
  app.get('/employer', function(req, res) {
    const dataForView = {title:"Empleador", layout:"employer"};
    res.render('home', dataForView);
  });

  app.post('/api/profile', function(req, res, next) {
    var parameters = extend(req.body, { acceptLanguage : i18n.lng() });

    personalityInsights.profile(parameters, function(err, profile) {
      if (err)
        return next(err);
      else
        return res.json(profile);
    });
  });
}
