var express = require('express'),
  router = express.Router(),
  UserModel = require('../model/user');

router.get('/', (req, res, next) => {
  res.send({

  });
});

router.put('/', (req, res, next) => {
  var user = new UserModel(req.body);
  user.save()
    .then(user => {
      res.status(201).send(user);
    })
    .catch((err) => {
      //@TODO implements error handler
      if (err.name === 'ValidationError' || err.code === 11000) {
        err.status = 422;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  UserModel.remove({_id: req.query.id}).then(() => {
    res.status(204).send();
  });
});

module.exports = router;
