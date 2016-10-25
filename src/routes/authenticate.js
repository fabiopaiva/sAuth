'use strict';

const express = require('express'),
    router = express.Router(),
    localStrategy = require('../strategy/local'),
    facebookRouter = require('./authenticate-facebook'),
    linkedinRouter = require('./authenticate-linkedin');

router.use('/facebook', facebookRouter);
router.use('/linkedin', linkedinRouter);
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
                    .catch(err => res.status(401).send({ error: err }));
        }

    } catch (error) {
        res.status(401).send({ error });
    }
}
