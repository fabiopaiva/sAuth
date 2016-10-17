var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  config = require('../config'),
  querystring = require('querystring'),
  User = require('../model/user'),
  generator = require('../strategy/token-generator');

var baseUrl = ('{protocol}://{hostname}:{port}')
  .replace('{protocol}', config.https ? 'https' : 'http')
  .replace('{hostname}', config.hostname)
  .replace('{port}', config.port);

passport.use(new FacebookStrategy({
  clientID: config.facebook.appId,
  clientSecret: config.facebook.appSecret,
  callbackURL: baseUrl + '/authenticate/facebook/callback',
  authorizationURL: baseUrl + '/authenticate/facebook/authorize',
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  (accessToken, refreshToken, profile, cb) => {
    var picture, email;
    if (profile._json.picture) {
      picture = profile._json.picture.data.url;
    }
    if (profile._json.email) {
      email = profile._json.email;
    }
    delete profile._json;
    delete profile._raw;
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    User.findOrCreate(
      { $or: [{'providerData.facebook.id': profile.id }, {'email' : email || ''}]},
      {
        "name": profile.displayName,
        "username": profile.id,
        "picture": picture,
        "role": "guest",
        "email": email,
        "provider": ["facebook"],
        "providerData": {facebook: profile}
      }
    )
      .then((user) => {
        return cb(null, user);
      })
      .catch(cb);
  }
));

router.get('/', passport.authenticate('facebook'));
router.get('/authorize', (req, res, next) => {
  res.send({
    authorizationURL: 'https://www.facebook.com/dialog/oauth?' + querystring.stringify(req.query)
  });
});
router.get('/callback', passport.authenticate('facebook'), (req, res) => {
  if (req.user) {
    let token = generator.generateAccessToken(req.user);
    res.send({ access_token: token, refresh_token: generator.generateRefreshToken(token) });
  } else {
    res.status(401).send({error: 'Authentication failed'});
  }
});

module.exports = router;
