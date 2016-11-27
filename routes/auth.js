module.exports = (app, privateKey, publicKey) => {
  const handyUtils = require('handyutils');
  const jwt = require('jsonwebtoken');
  const userAccount = require('../models/account');
  app.get('/', (req, res) =>{
    const dataForView = {title:'Inicio', layout:'main'};
    res.render('home',dataForView);
  });
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
  * Auth for Employer routes
  */
  app.all('/employer/*', (req, res, next) => {
    handyUtils.debug('Employer Auth ran, req.path: ', req.path);
    const reqRef = req;
    if (checkCookie(req)) {
      // verify a token asymmetric
      jwt.verify(req.cookies.auth, publicKey, (decodedErr, decodedToken) => {
        if (decodedToken === undefined) {
          res.redirect('/');
          next();
        } else if (decodedToken.iss === 'system' && decodedToken.employer === true) {
          reqRef.body.decodedInfo = decodedToken;
          next();
        }
      });
    } else if (!checkCookie(req)) {
      res.redirect('/signin');
      next();
    }
  });
  // Verify login credentials
  app.post('/verify/signin', (req, res) => {
    handyUtils.debug('req at /verify/signin', req);
    // read from DB to see what type of account they have
    userAccount.find({ email: req.body.email }, (err, result) => {
      handyUtils.debug('err from query at /verify/signin', err);
      handyUtils.debug('results from query at /verify/signin', result);
      if (result[0] === undefined) {
        const errorMessage = 'El correo electrónico que ha ingresado no esta en nuestros registros.';
        req.flash('error', errorMessage);
        res.redirect('/signin');
      } else if (!result[0].confirmed) {
        // if the account has not been verified
        const errorMessage = 'Por favor ingrese a su correo electrónico y confirme la valides de su correo electrónico.';
        req.flash('error', errorMessage);
        res.redirect('/');
      } else {
        // decrypt password and store it
        // verify a token asymmetric
        jwt.verify(result[0].password, publicKey, (decodedErr, decodedToken) => {
          if (req.body.password === decodedToken.password) {
            if (result[0].admin) {
              // Process Admin
              const token = jwt.sign({ alg: 'RS256', typ: 'JWT', admin: result[0].admin,
              userId: result[0].userId },
              privateKey, { algorithm: 'RS256', issuer: 'system', expiresIn: 86400000 });
              res.cookie('authorization', token,
              { expires: new Date(Date.now() + 9000000), maxAge: 9000000 });
              res.redirect('/employer/dashboard');
            }  else {
            const errorMessage = 'La contraseña que ha ingresado no esta en nuestros registros.';
            req.flash('error', errorMessage);
            res.redirect('/signin');
          }
        }
        });
      }
    });
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
