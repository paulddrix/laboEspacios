module.exports = (app) => {
  require('./candidate')(app);
  require('./employer')(app);
}
