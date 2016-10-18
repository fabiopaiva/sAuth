'use strict';

const express = require('express'),
    router = express.Router(),
    localStrategy = require('../strategy/local'),
    facebookRouter = require('./authenticate-facebook');

router.use('/facebook', facebookRouter);
router.post('/', postRouter);

module.exports = router;

// @todo: come with a more appropriate name
function postRouter (req, res) {
    try {
        if (!req.body.provider) {
            // @todo: maybe handling the error with a rollbar notification
            throw 'Missing provider';
        }

        switch (req.body.provider) {
            case 'facebook':
                res.redirect('/authenticate/facebook');
                break;
            case 'local':
            default:
                localStrategy(req.body)
                    .then(data => res.send(data))
                    .catch(err => res.send(401, { error: err }));
        }

    } catch (error) {
        res.send(401, { error });
    }
}
