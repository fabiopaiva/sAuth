'use strict';

const express = require('express'),
    router = express.Router(),
    UserModel = require('../model/user');

router.get('/', getUsers);
router.get('/self/details', getUserDetail);
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
        //@TODO implements erroar handler
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

function getUserDetail(req, res, next) {
    UserModel.findOne({_id: req.user.id}).then(user => res.send(user));
}
