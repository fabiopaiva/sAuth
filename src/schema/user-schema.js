var app = require('../index');
var mongoose = app.get('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = require('mongoose').Schema({
  name: String,
  email: {type: String, required: true, index: { unique: true }},
  provider: {type: String, required: true},
  username: {type: String, required: true, index: { unique: true }},
  password: String,
  createdAt: { type: Date, default: Date.now },
  updateAt: Date
});

module.exports = mongoose.model('User', UserSchema);
