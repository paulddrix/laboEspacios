module.exports = (app, watson) => {
  require('./candidate')(app);
  require('./employer')(app);
  require('./test')(app, watson);
}
