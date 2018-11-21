const rp = require('request-promise');

module.exports.controller = (app) => {

  // register page
  app.get('/home', (req, res) => {
    console.log(req.session.user_id);
    if (!req.session.sub){
      return res.redirect('/')
    }

    const options = {
      uri: "http://wis-ecs-services-425328152.us-east-1.elb.amazonaws.com/worker/" + req.session.user_id,
      headers: {
        'Authorization': 'Bearer ' + req.session.tokens.accessToken  + " : " + req.session.tokens.idToken 
      },
      method: 'GET'
    };
    rp(options)
      .then(function (data) {
        data = JSON.parse(data)
        // console.log("Data::"+JSON.stringify(data));
        console.log(data);
        res.render('home', { user: data })
      })
      .catch (function (err) {
        console.log('ERROR2:' + err);
        // return res.redirect('/')
      })
  });
};
