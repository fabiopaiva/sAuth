var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var routes = require('./routes/index');

app.use('/', routes);

var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise;
var options = { promiseLibrary: Promise };
var uri = process.env.MONGO_URI || 'mongodb://mongo/test';

app.set('mongoose', mongoose.createConnection(uri, options));

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

app.listen(port, () => {
   console.log('Listening on port ' + port);
});

module.exports = app;
