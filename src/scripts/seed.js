var seeder = require('mongoose-seed'),
  data = require('../../data/seed.json'),
  config = require('../config');


seeder.connect(config.mongoUri, () => {
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
