var express = require('express'),
  router = express.Router(),
  localStrategy = require('../strategy/local'),
  facebookRouter = require('./authenticate-facebook');

router.use('/facebook', facebookRouter);
router.post('/', (req, res, next) => {
  try {
    if (!req.body.provider) throw 'Missing provider';

    switch (req.body.provider) {
      case 'facebook':
        res.redirect('/authenticate/facebook');
        break;
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
    res.status(401).send({
      error: error
    });
  }
});

module.exports = router;
