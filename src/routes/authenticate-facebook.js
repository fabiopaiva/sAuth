'use strict';

const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('../config'),
    querystring = require('querystring'),
    User = require('../model/user'),
    generator = require('../strategy/token-generator');

let protocol = config.https ? 'https' : 'http',
    baseUrl = `${protocol}://${config.hostname}`;

if (process.env.NODE_ENV !== 'production') {
    baseUrl = baseUrl.concat(`:${config.port}`);
}

const facebookOptions = {
    clientID: config.facebook.appId,
    clientSecret: config.facebook.appSecret,
    callbackURL: `${baseUrl}/authenticate/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'emails', 'profileUrl','gender', 'education', 'work']
};

let facebookStrategy = new FacebookStrategy(facebookOptions, facebookStrategyCallback);
passport.use(facebookStrategy);

router.get('/', getAuthorize);
router.get(
    '/callback',
    updateCallbackUrl,
    passport.authenticate(
        'facebook',
        { scope: ['public_profile', 'email', 'user_work_history', 'user_education_history'] }
    ),
    getCallback
);

module.exports = router;

function updateCallbackUrl(req, res, next) {
    if (req.query.redirect_uri) {
        facebookStrategy._callbackURL = req.query.redirect_uri;
    }
    next();
}

function facebookStrategyCallback (accessToken, refreshToken, profile, cb) {
    let picture, email;
    if (profile._json.picture) {
        picture = profile._json.picture.data.url;
    }
    if (profile._json.email) {
        email = profile._json.email;
    }
    //delete profile._json;
    //delete profile._raw;
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    // TODO: Use the `User.findOneAndUpdate` with upsert:true
    User.findOrCreate(
        {'email': email || ''},
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
        .then(user => cb(null, user))
        .catch(cb);
}

function getAuthorize (req, res, next) {
    let query = {
        redirect_uri: req.query.redirect_uri,
        client_id: config.facebook.appId,
        scope: config.facebook.scope
    };
    res.send({
        authorizationURL: 'https://www.facebook.com/dialog/oauth?' + querystring.stringify(query)
    });
}

function getCallback (req, res) {
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
