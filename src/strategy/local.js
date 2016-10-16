var UserModel = require('../model/user'),
  Promise = require('bluebird'),
  jwt = require('jsonwebtoken'),
  config = require('../config');

generateAccessToken = (user) => {
  return jwt.sign({
    id: user._id,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + config.expires.accessToken
  }, config.secret);
};

generateRefreshToken = (token) => {
  return jwt.sign({
    token: token,
    exp: Math.floor(Date.now() / 1000) + config.expires.refreshToken
  }, config.secret);
};

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ username: data.username })
      .then((user) => {
        user.comparePassword(data.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            return reject({ error: 'Authentication failed' });
          };
          let token = generateAccessToken(user);
          resolve({ access_token: token, refresh_token: generateRefreshToken(token) });
        });
      })
      .catch(reject);
  });
}
