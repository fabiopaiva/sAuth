var mongoose = require('mongoose'),
  config = require('./config'),
  Promise = require('bluebird'),
  initialized = false;

module.exports = () => {
  if (!initialized) {
    mongoose.connect(config.mongoUri);
    mongoose.Promise = Promise;
    initialized = true;
  }
}
