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
    handyUtils.debug('Employer Auth ran, req: ', req);
    handyUtils.debug('Employer Auth ran, req.path: ', req.path);
    const reqRef = req;
    if (checkCookie(req)) {
      handyUtils.debug('COOKIE detected ', req.cookies.authorization);
      // verify a token asymmetric
      jwt.verify(req.cookies.authorization, publicKey, (decodedErr, decodedToken) => {
        handyUtils.debug('decodedToken /employer/*', decodedToken);
        if (decodedToken === undefined) {
          handyUtils.debug('undefined detected ', '');
          res.redirect('/');
          next();
        } else if (decodedToken.iss === 'system' && decodedToken.employer === true) {
          handyUtils.debug('next() ', {});
          reqRef.body.decodedInfo = decodedToken;
          next();
        }
      });
    } else if (!checkCookie(req)) {
      res.redirect('/signin');
      next();
    }
  });
  // Verify signup credentials
  app.post('/verify/signup', (req, res) => {
    handyUtils.debug('req at /verify/signup', req);
    handyUtils.debug('req.body at /verify/signup', req.body);
    if (req.body.captcha !== '100') {
      const errorMessage = 'Por favor resuelva el problema matematico para verificar que usted es un humano.';
      req.flash('error', errorMessage);
      res.redirect('/signup');
    } else {
      // read from DB to see if the email is already being used
      // if not, then create the account
      const query = { email: req.body.email };
      userAccount.find(query, (err, result) => {
        handyUtils.debug('results from find query at /verify/signup', result);
        // the user does not exist in our DB
        if (result[0] === undefined) {
          handyUtils.debug('user does not exist in DB', result);
          // encrypt the user's password with jwt before it goes into the db
          const encryptedPassword = jwt.sign({ alg: 'RS256',
          typ: 'JWT', password: req.body.password },
          privateKey, { algorithm: 'RS256', issuer: 'system' });
          const newUser = {
            companyName:req.body.companyName,
            email: req.body.email,
            confirmed: false,
            employer:true,
            password: encryptedPassword,
            userId: Math.floor((Math.random() * 99999999) + 10000000),
          };
          userAccount.create(newUser, (createErr, createRes) => {
            if (createErr) {
              const errorMessage = 'Ocurrió un error al intentar crear su cuenta.';
              req.flash('error', errorMessage);
              res.redirect('/');
            }
            if (createRes) {
              const successMessage = 'La cuenta fue creada con exito, diríjase a su correo electrónico y verifique su información.';
              req.flash('success', successMessage);
              res.redirect('/');
            }
          });
        } else {
          handyUtils.debug('user does exist in DB', result);
          // The user is already in the DB
          const errorMessage = 'El correo electrónico que has ingresado ya existe en nuestros registros, por favor intenta recuperar la contraseña.';
          req.flash('error', errorMessage);
          res.redirect('/signup');
        }
      });
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
        handyUtils.debug('undefined from query at /verify/signin', result[0]);
        const errorMessage = 'El correo electrónico que ha ingresado no esta en nuestros registros.';
        req.flash('error', errorMessage);
        res.redirect('/signin');
      } else if (!result[0].confirmed) {
        handyUtils.debug('not confirmed from query at /verify/signin', result[0].confirmed);
        // if the account has not been verified
        const errorMessage = 'Por favor ingrese a su correo electrónico y confirme la valides de su correo electrónico.';
        req.flash('error', errorMessage);
        res.redirect('/');
      } else {
        handyUtils.debug('decrypting pass at /verify/signin', result[0].password);
        // decrypt password and store it
        // verify a token asymmetric
        jwt.verify(result[0].password, publicKey, (decodedErr, decodedToken) => {
          handyUtils.debug('decodedToken at /verify/signin', decodedToken);
          if (req.body.password === decodedToken.password) {
            handyUtils.debug('contrast pass at /verify/signin', decodedToken);
            if (result[0].employer) {
              handyUtils.debug('employer at /verify/signin', decodedToken);
              // Process Admin
              const token = jwt.sign({ alg: 'RS256', typ: 'JWT', employer: result[0].employer,
              userId: result[0].userId },
              privateKey, { algorithm: 'RS256', issuer: 'system', expiresIn: 86400000 });
              res.cookie('authorization', token,
              { expires: new Date(Date.now() + 9000000), maxAge: 9000000 });
              res.redirect('/employer/dashboard');
            } else {
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
