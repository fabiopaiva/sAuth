var assert = require('assert'),
  UserModel = require('../src/model/user'),
  Promise = require('bluebird');

before((done) => {
  require('../src/mongoose-setup')();
  done();
});

describe('Mongoose', () => {
  describe('#Bluebird', () => {
    it('Should use Bluebird as default promise', () => {
      assert.equal(UserModel.findOne({}).exec().constructor, Promise);
    });
  });
});
