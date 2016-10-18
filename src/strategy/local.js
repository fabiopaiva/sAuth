'use strict';

const UserModel = require('../model/user'),
    Promise = require('bluebird'),
    config = require('../config'),
    generator = require('./token-generator');


module.exports = function LocalStrategy (data) {
    return new Promise(promise);

    function promise (resolve, reject) {
        if (!data.username) return reject({error: 'Missing username'});
        if (!data.password) return reject({error: 'Missing password'});

        UserModel.findOne({username: data.username})
            .then(success)
            .catch(reject);

        function success(user) {
            user.comparePassword(data.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) {
                    return reject({error: 'Authentication failed'});
                }

                let token = generator.generateAccessToken(user);

                resolve({
                    access_token: token,
                    refresh_token: generator.generateRefreshToken(token)
                });
            });
        }
    }
}
