'use strict';

const path = require('path'),
    seeder = require('mongoose-seed'),
    data = require(path.resolve('./data/seed.json')),
    config = require(path.resolve('./config'));


seeder.connect(config.mongoUri, function seederLoader () {
    seeder.loadModels([
        __dirname + '/../model/user'
    ]);
    seeder.clearModels(['User'], () => {
        seeder.populateModels(data, () => {
            console.log('Data imported');
            process.exit();
        });
    });
});
