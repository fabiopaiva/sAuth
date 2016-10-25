'use strict';

const express = require('express'),
    router = express.Router(),
    config = require('../config'),
    querystring = require('querystring'),
    passport = require('passport'),
    LinkedinTokenStrategy = require('passport-linkedin-token-oauth2').Strategy,
    OAuth2 = require('oauth').OAuth2,
    User = require('../model/user'),
    generator = require('../strategy/token-generator');

const linkedinOptions = {
    clientID: config.linkedin.appId,
    clientSecret: config.linkedin.appSecret
};

let strategy = new LinkedinTokenStrategy(linkedinOptions, function(accessToken, refreshToken, profile, done) {

    let email;
    if (profile._json.emailAddress) {
        email = profile._json.emailAddress;
    }
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    // TODO: Use the `User.findOneAndUpdate` with upsert:true
    User.findOrCreate(
        {'email': email || ''},
        {
            "name": profile._json.firstName,
            "username": profile.id,
            "role": "guest",
            "email": email,
            "provider": ["linkedin"],
            "providerData": {linkedin: profile}
        }
    )
        .then(user => done(null, user))
        .catch(done);
  });

passport.use(strategy);

router.get('/', getAuthorize);
router.get('/callback', processCallback, passport.authenticate('linkedin-token'), postCallback);


module.exports = router;

function getAuthorize (req, res, next) {
    let query = {
        redirect_uri: req.query.redirect_uri,
        client_id: config.linkedin.appId,
        scope: config.linkedin.scope,
        response_type:'code',
        state: ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
    };
    res.send({
        authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization?' + querystring.stringify(query)
    });
}


function processCallback(req, res, next) {
    var code = req.query.code,
        options = {
            client_id: config.linkedin.appId,
            client_secret: config.linkedin.appSecret,
            redirect_uri: req.query.redirect_uri,
            grant_type: 'authorization_code'
        },
        oauth2 = new OAuth2(
            options['client_id'],
            options['client_secret'],
            'https://www.linkedin.com',
            '',
            '/uas/oauth2/accessToken');

    oauth2.getOAuthAccessToken(code, options, function (err, access_token, refresh_token, results) {
        if (err) { return next(new Error(err.data)) }

        //include access_token and expires into body to request for token
        req.body.access_token = access_token;
        req.body.expires = results.expires;

        next();
    });
}

function postCallback (req, res) {
    if (req.user) {
        let token = generator.generateAccessToken(req.user);
        res.send({
            access_token: token,
            refresh_token: generator.generateRefreshToken(token)
        });
    } else {
        res.status(401).send({error: 'Authentication failed'});
    }
}
