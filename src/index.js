var express = require('express'),
  app = module.exports = express(),
  config = require('./config'),
  bodyParser = require('body-parser'),
  jwtExpress = require('express-jwt');

require('./mongoose-setup')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(jwtExpress({ secret: config.secret })
  .unless({
    path: ['/authenticate', '/refresh-token', '/user/recover']
  }));
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));

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

app.listen(config.port, () => {
  console.log('Listening on port ' + config.port);
});
