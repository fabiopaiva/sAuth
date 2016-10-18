'use strict';

const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR || 10,
    Promise = require('bluebird');

var UserSchema = mongoose.Schema({
    name: String,
    username: {type: String, index: {unique: true}},
    picture: String,
    email: {type: String, index: {unique: true}},
    role: {type: String, default: 'user'}, // TODO: Transform `role` into array of `roles`
    password: String,
    createdAt: {type: Date, default: Date.now},
    updateAt: Date,
    provider: [{type: String, required: true}],
    providerData: mongoose.Schema.Types.Mixed
});

UserSchema.pre('save', preSaveUser);
UserSchema.methods.comparePassword = comparePassword;

UserSchema.statics.findOrCreate = findOrCreate;

module.exports = mongoose.model('User', UserSchema);

function preSaveUser (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function generatePasswordSalt (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function hashPassword (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
}

function comparePassword (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

function findOrCreate (query, data) {
    return new Promise(promiseHandler);

    function promiseHandler (resolve, reject) {
        mongoose.model('User').findOne(query)
            .then(success)
            .catch(reject);

        function success (result) {
            if (result) {
                resolve(result);
            }
            else {
                var user = new (mongoose.model('User'))(data);
                // TODO: Callback hell detected!
                user.save()
                    .then(resolve)
                    .catch(reject);
            }
        }
    }
}
