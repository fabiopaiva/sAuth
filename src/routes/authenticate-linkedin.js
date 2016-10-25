'use strict';

const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    //LinkedinStrategy = require('passport-linkedin').Strategy,
    config = require('../config'),
    querystring = require('querystring'),
    User = require('../model/user'),
    generator = require('../strategy/token-generator');

let protocol = config.https ? 'https' : 'http',
    baseUrl = `${protocol}://${config.hostname}`;

if (process.env.NODE_ENV !== 'production') {
    baseUrl = baseUrl.concat(`:${config.port}`);
}

const linkedinOptions = {
    clientID: config.linkedin.appId,
    clientSecret: config.linkedin.appSecret
};

router.get('/', getAuthorize);

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
