module.exports = {
  mongoUri: process.env.MONGO_URI || 'mongod://localhost/test',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'secretString',
  expires: {
   accessToken: process.env.ACCESS_TOKEN_EXPIRES_IN || 3600 * 24,
   refreshToken:  process.env.REFRESH_TOKEN_EXPIRES_IN || 3600 * 24 * 30
  }
}
