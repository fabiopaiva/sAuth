var app = require('../index');
var mongoose = app.get('mongoose');

var User = mongoose.model(
  'User',
  {
    name: String,
    email: String,
    provider: String,
    username: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    updateAt: Date
  }
);

module.exports = User;
