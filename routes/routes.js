module.exports = (app, watson, privateKey, publicKey) => {
  require('./auth')(app, privateKey, publicKey);
  require('./candidate')(app, watson);
  require('./employer')(app);
}
