var express = require('express');
var router = express.Router();
var UserSchema = require('../schema/user-schema');

router.get('/', (req, res, next) => {
  res.send({

  });
});

router.put('/', (req, res, next) => {
  var user = new UserSchema(req.body);
  user.save().then(user => {
    res.status(201).send(user);
  });
});

router.delete('/:id', (req, res, next) => {
  UserSchema.remove({_id: req.query.id}).then(() => {
    res.status(204).send();
  });
});

module.exports = router;
