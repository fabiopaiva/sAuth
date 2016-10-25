'use strict';

const express = require('express'),
    app = module.exports = express(),
    config = require('./config'),
    bodyParser = require('body-parser'),
    jwtExpress = require('express-jwt'),
    passport = require('passport');

require('./mongoose-setup')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

app.use(jwtExpress({secret: config.secret})
    .unless({
        path: [
            '/authenticate',
            '/authenticate/facebook',
            '/authenticate/facebook/callback',
            '/authenticate/linkedin',
            '/authenticate/linkedin/callback',
            '/refresh-token',
            '/user/recover'
        ]
    }));

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));
app.use('/authenticate', require('./routes/authenticate'));

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

app.listen(config.port, () => {
    console.log('Listening on port ' + config.port);
});
