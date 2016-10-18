'use strict';

const express = require('express'),
    router = express.Router();

router.get('/ping', getPing);

module.exports = router;

function getPing (req, res) {
    res.send({
        time: Date.now()
    });
}
