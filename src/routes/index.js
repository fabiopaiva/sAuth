var express = require('express');
var router = express.Router();
var localStrategy = require('../strategy/local');

router.get('/ping', (req, res, next) => {
  res.send({
    time: Date.now()
  });
});

router.post('/authenticate', (req, res, next) => {
  try {
    if (! req.body.username) throw 'Missing username';
    if (! req.body.password) throw 'Missing password';
    if (! req.body.provider) throw 'Missing provider';

    switch (req.body.provider) {
      case 'local':
      default:
        localStrategy(req.body)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(401).send({
              error: err
            });
          });
      break;
    }

  } catch (error) {
    res.status(422).send({
      error: error
    });
  }
});

module.exports = router;
