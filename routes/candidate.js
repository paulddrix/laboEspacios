module.exports = (app) => {
  app.get('/candidate', (req,res) =>{
    const dataForView = {title:"Candidato", layout:"candidate"};
    res.render('home', dataForView);
  });
}
