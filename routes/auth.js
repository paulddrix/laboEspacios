module.exports = (app, privateKey, publicKey) => {
  const handyUtils = require('handyutils');
  const jwt = require('jsonwebtoken');
  const userAccount = require('../models/account');

  // Check cookie function
  function checkCookie(req) {
    if (req.cookies.authorization === undefined ||
        req.cookies.authorization === '' ||
        req.cookies.authorization === null ||
        req.cookies.authorization === 'logged-out') {
      return false;
    }
    return true;
  }
  /*
  * Auth for Admin routes
  */
  app.all('/admin/*', (req, res, next) => {
    handyUtils.debug('Editor Auth ran, req.path: ', req.path);
    const reqRef = req;
    if (checkCookie(req)) {
      // verify a token asymmetric
      jwt.verify(req.cookies.auth, publicKey, (decodedErr, decodedToken) => {
        if (decodedToken === undefined) {
          res.redirect('/');
          next();
        } else if (decodedToken.iss === 'system' && decodedToken.admin === true) {
          reqRef.body.decodedInfo = decodedToken;
          next();
        }
      });
    } else if (!checkCookie(req)) {
      res.redirect('/login');
      next();
    }
  });
  /*
  LOGOUT
  */
  app.get('/logout', (req, res) => {
    res.cookie('authorization', 'logged-out');
    const successMessage = 'Successfully logged out.';
    req.flash('success', successMessage);
    res.redirect('/');
  });
  app.get('/', () =>{
    const dataForView = {title:'Inicio', layout:'main'};
  });
  /*
  FORGOT PASSWORD
  */
  app.get('/forgotpassword', (req, res) => {
    res.render('forgotPassword');
  });
  /*
  HANDLE FORGOT PASSWORD
  */
  app.post('forgotpassword/handler', (req, res) => {
    // FIXME: need to add functionality to be able to reset a PASSWORD
    res.redirect('/login');
  });
}
