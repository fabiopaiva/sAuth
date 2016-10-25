module.exports = {
    mongoUri: process.env.MONGO_URI || 'mongod://localhost/sauth',
    hostname: process.env.HOST || 'localhost',
    https: process.env.HTTPS == 1 ? true : false,
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || 'secretString',
    expires: {
        accessToken: process.env.ACCESS_TOKEN_EXPIRES_IN || 3600 * 24,
        refreshToken: process.env.REFRESH_TOKEN_EXPIRES_IN || 3600 * 24 * 30
    },
    facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
        scope: process.env.FACEBOOK_APP_SCOPE || [
            'public_profile',
            'email'
        ].join(',')
    },
    linkedin: {
        appId: process.env.LINKEDIN_CLIENT_ID,
        appSecret: process.env.LINKEDIN_CLIENT_SECRET,
        scope: process.env.LINKEDIN_CLIENT_SCOPE || [
            'r_basicprofile',
            'r_emailaddress'
        ].join(' ')
    }
}
