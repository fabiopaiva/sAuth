var express = require('express'),
  router = express.Router();

router.get('/ping', (req, res, next) => {
  res.send({
    time: Date.now()
  });
});

module.exports = router;
