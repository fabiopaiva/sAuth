var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR || 10;

var UserSchema = mongoose.Schema({
  name: String,
  username: {type: String, required: true, index: { unique: true }},
  email: {type: String, required: true, index: { unique: true }},
  role: {type: String, default: 'user'},
  provider: {type: String, required: true},
  password: String,
  createdAt: { type: Date, default: Date.now },
  updateAt: Date
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
