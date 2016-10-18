var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR || 10,
    Promise = require('bluebird');

var UserSchema = mongoose.Schema({
    name: String,
    username: {type: String, index: {unique: true}},
    picture: String,
    email: {type: String, index: {unique: true}},
    role: {type: String, default: 'user'},
    password: String,
    createdAt: {type: Date, default: Date.now},
    updateAt: Date,
    provider: [{type: String, required: true}],
    providerData: mongoose.Schema.Types.Mixed
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.statics.findOrCreate = (query, data) => {
    return new Promise((resolve, reject) => {
        mongoose.model('User').findOne(query)
            .then((result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    var user = new (mongoose.model('User'))(data);
                    user.save().then(resolve).catch(reject);
                }
            })
            .catch(reject);
    });
};

module.exports = mongoose.model('User', UserSchema);
