const rp = require('request-promise');
const config = require('./../config/cognito.json');
const poolData = {
  UserPoolId: config.userPoolId,
  ClientId: config.ClientId
};
const amazonCognitoIdentity = require('amazon-cognito-identity-js');
const userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.controller = (app) => {

  // login page
  app.get('/users/login', (req, res) => {
    res.render('login')
  });
  
  // register a user
  app.post('/users/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;

    req.check('email', 'Invalid email').isEmail();

    const errors = req.validationErrors();
    req.session['sign-up-errors'] = []

    if(errors) {
      for(let error of errors) {
        req.session['sign-up-errors'].push(error.msg)
      }
      return res.redirect('/')
    }

    const emailData = {
      Name: 'email',
      Value: email
    }
    const roleData = {
      Name: 'custom:role',
      Value: 'Worker'
    }

    const options = {
      uri: "http://wis-ecs-services-425328152.us-east-1.elb.amazonaws.com/worker",
      method: 'POST',
      body: {
        email: email,
        password: password
      },
      json: true
    };
    rp(options)
      .then(function (data) {
        // data = JSON.parse(data)
        // console.log("Data::"+JSON.stringify(data));
        console.log(data);
        const idData = {
          Name: 'custom:id',
          Value: data['Id']
        }
        const emailAttribute = new amazonCognitoIdentity.CognitoUserAttribute(emailData);
        const roleAttribute = new amazonCognitoIdentity.CognitoUserAttribute(roleData);
        const idAttribute = new amazonCognitoIdentity.CognitoUserAttribute(idData);

        userPool.signUp(email, password, [ emailAttribute, roleAttribute, idAttribute], null, (err, data) => {
          if(err && err.code !== 'UnknownError') {
            console.error(err);
            req.session['sign-up-errors'].push(err.message.replace('Password did not conform with policy:',''));
            return res.redirect('/')
          }
          return res.redirect('/users/login');
        })
      })
      .catch (function (err) {
        console.log('ERROR2:' + err);
      })
  });

  // sign in a user
  app.post('/users/login', function(req, res, next){
    const email = req.body.email;
    const loginDetails = {
      Username: email,
      Password: req.body.password
    }
  
    const authenticationDetails = new amazonCognitoIdentity.AuthenticationDetails(loginDetails);
  
    const userDetails = {
      Username: email,
      Pool: userPool
    }
  
    req.session['log-in-errors'] = [];
  
    const cognitoUser = new amazonCognitoIdentity.CognitoUser(userDetails)
  
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (data) {
        console.log(data);
        req.session.sub = data.idToken.payload.sub
        req.session.user_id = data.idToken.payload['custom:id']
        req.session.tokens = {
                                idToken: data.idToken.jwtToken,
                                refreshToken: data.refreshToken.token,
                                accessToken: data.accessToken.jwtToken
                              }
        // res.send({ data: data });
        res.redirect('/home');
      },
      onFailure: function (error) {
        // req.session['log-in-errors'].push(error.message);
        // console.log(error.message);
        req.flash('info', error.message);
        res.redirect('/users/login')
        // res.status(422).send(error.message)
        // res.status(422);
        // res.send({ error: 'Username or password incorrect!' });
      }
    });
  
  });

  //sign out a user
  app.get('/users/sign_out', function(req, res, next){
    req.session.sub = null;
    req.session.tokens = null;
    req.session.user_id = null
    res.redirect('/');
  });
};
