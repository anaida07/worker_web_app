module.exports.controller = (app) => {

  // register a user
  app.get('/', (req, res) => {
    res.render('index', { title: "Express"})
  });
};
