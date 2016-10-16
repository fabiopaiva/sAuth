# sAuth
Secure authentication provider

## Installation

    npm install

## Run Application

    SECRET=testSecretString MONGO_URI="mongodb://localhost/app" npm start

## Run Tests

    SECRET=testSecretString MONGO_URI="mongodb://localhost/test" npm test

## Seed database

    MONGO_URI='mongodb://mongo/app' npm run-script seed

## Environment Variables

| Name                     | Description                                           | Default                  |
|:-------------------------|:------------------------------------------------------|:-------------------------|
| PORT                     | The port which will run Express                       | 3000                     |
| MONGO_URI                | URI string for establish a connection with MongoDB    | mongod://localhost/sauth |
| SECRET                   | A key to sign your JWT                                | secretString             |
| ACCESS_TOKEN_EXPIRES_IN  | Time in seconds to expire the generated access token  | 86400                    |
| REFRESH_TOKEN_EXPIRES_IN | Time in seconds to expire the generated refresh token | 2592000                  |
