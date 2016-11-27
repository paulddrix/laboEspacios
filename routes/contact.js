module.exports = (app) => {
  app.get('/contact', (req, res)=>{
    res.render('contact');
  });
  // Handle 404
    app.use(function(req, res) {
      res.status(400);
      res.render('404', {title: '404: File Not Found', error:'this is not the page you are lookign for'});
    });

    // Handle 500
    app.use(function(error, req, res, next) {
        res.status(500);
       res.render('500', {title:'500: Internal Server Error', error: error});
    });
}
