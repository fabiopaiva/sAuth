var express = require('express');
var router = express.Router();

router.get('/ping', (req, res, next) => {
  res.send({
    time: Date.now()
  });
});

router.post('/authenticate', (req, res, next) => {
  res.send({});
});

module.exports = router;
