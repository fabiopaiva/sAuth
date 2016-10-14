var express = require('express');
var app = module.exports = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var jwtExpress = require('express-jwt');

//mongoose
mongoose.Promise = Promise;
var options = { promiseLibrary: Promise };
app.set('mongoose', mongoose.createConnection(process.env.MONGO_URI, options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));

app.use(jwtExpress({ secret: process.env.SECRET})
  .unless({
    path: ['/authenticate', '/refresh-token', '/user/recover']
  }));

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
