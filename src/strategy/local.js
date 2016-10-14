var UserSchema = require('../schema/user-schema');
var Promise = require('bluebird');
var jwt = require('jsonwebtoken');

generateAccessToken = (user) => {
  return jwt.sign({
    id: user._id,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + (process.env.TOKEN_EXPIRES_IN || 3600 * 24)
  }, process.env.SECRET);
};

generateRefreshToken = (token) => {
  return jwt.sign({
    token: token,
    exp: Math.floor(Date.now() / 1000) + (process.env.TOKEN_EXPIRES_IN || 3600 * 24 * 12)
  }, process.env.SECRET);
};

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    UserSchema.findOne({ username: data.username })
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
