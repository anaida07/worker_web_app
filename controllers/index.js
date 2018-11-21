module.exports.controller = (app) => {

  // register page
  app.get('/', (req, res) => {
    console.log(req.session);
    res.render('index')
  });
};
