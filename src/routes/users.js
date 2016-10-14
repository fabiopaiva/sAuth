var express = require('express');
var router = express.Router();


router.get('/', (req, res, next) => {
  res.send({
    time: Date.now()
  });
});

module.exports = router;
