'use strict';

const express = require('express'),
    router = express.Router(),
    UserModel = require('../model/user');

router.get('/', getUsers);
router.put('/', putUser);
router.delete('/:id', deleteUser);

module.exports = router;

function getUsers (req, res) {
    res.send({});
}

function putUser (req, res, next) {
    let user = new UserModel(req.body);

    user.save()
        .then(user => res.status(201).send(user))
        .catch(error);

    function error (err) {
        //@TODO implements error handler
        if (err.name === 'ValidationError' || err.code === 11000) {
            err.status = 422;
        }
        next(err);
    }
}

function deleteUser (req, res, next) {
    UserModel.remove({ _id: req.query.id })
        .then(success);

    function success () {
        return res.sendStatus(204);
    }
}
