var UserModel = require('../model/user'),
  Promise = require('bluebird'),
  config = require('../config'),
  generator = require('./token-generator');


module.exports = (data) => {
  return new Promise((resolve, reject) => {
    if (! data.username) return reject({ error: 'Missing username' });
    if (! data.password) return reject({ error: 'Missing password' });

    UserModel.findOne({ username: data.username })
      .then((user) => {
        user.comparePassword(data.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            return reject({ error: 'Authentication failed' });
          };
          let token = generator.generateAccessToken(user);
          resolve({ access_token: token, refresh_token: generator.generateRefreshToken(token) });
        });
      })
      .catch(reject);
  });
}
