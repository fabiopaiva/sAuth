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
