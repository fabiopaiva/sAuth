'use strict'

const jwt = require('jsonwebtoken'),
    config = require('../config');

module.exports = {
    generateAccessToken,
    generateRefreshToken
};

function generateAccessToken (user) {
    return jwt.sign({
        id: user._id,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + config.expires.accessToken
    }, config.secret);
}

function generateRefreshToken (token) {
    return jwt.sign({
        token: token,
        exp: Math.floor(Date.now() / 1000) + config.expires.refreshToken
    }, config.secret);
}
