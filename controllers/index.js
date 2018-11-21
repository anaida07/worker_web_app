module.exports.controller = (app) => {

  // register page
  app.get('/', (req, res) => {
    res.render('index')
  });
};
