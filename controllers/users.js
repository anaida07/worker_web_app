const config = require('./../config/cognito.json');
const poolData = {
  UserPoolId: config.userPoolId,
  ClientId: config.ClientId
};
const amazonCognitoIdentity = require('amazon-cognito-identity-js');
const userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.controller = (app) => {

  // register a user
  app.post('/users/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;

    req.check('email', 'Invalid email').isEmail();

    const errors = req.validationErrors();
    // req.session['sign-up-errors'] = []

    if(errors) {
      for(let error of errors) {
        // req.session['sign-up-errors'].push(error.msg)
      }
      // return res.redirect('/')
      res.send('error');
    }

    const emailData = {
      Name: 'email',
      Value: email
    }
    const roleData = {
      Name: 'custom:role',
      Value: 'Worker'
    }

    const emailAttribute = new amazonCognitoIdentity.CognitoUserAttribute(emailData);
    const roleAttribute = new amazonCognitoIdentity.CognitoUserAttribute(roleData);

    userPool.signUp(email, password, [ emailAttribute, roleAttribute], null, (err, data) => {
      if(err && err.code !== 'UnknownError') {
        console.error(err);
        // req.session['sign-up-errors'].push(err.message.replace('Password did not conform with policy:',''));
        // return res.redirect('/')
        res.send('error');
      }
      // return res.redirect('/profile');
      res.send('success');
    })
  });
};
