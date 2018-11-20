module.exports.controller = (app) => {

  // register a user
  app.get('/profile', (req, res) => {
    res.render('profile', { title: "Express"})
  });
};
