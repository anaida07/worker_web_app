module.exports.controller = (app) => {

  // register page
  app.get('/', (req, res) => {
    console.log(req.session);
    res.render('index')
  });

  app.get('/service_status', (req, res) => {
    res.send('All Good')
  });
};
