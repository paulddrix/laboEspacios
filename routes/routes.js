module.exports = (app, watson) => {
  require('./candidate')(app, watson);
  require('./employer')(app);
}
