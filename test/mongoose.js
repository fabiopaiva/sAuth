var assert = require('assert');
var app = require('../src/index');
var mongoose = app.get('mongoose');
var UserSchema = require('../src/schema/user-schema');

describe('Mongoose', () => {
  describe('#Bluebird', () => {
    it('Should use Bluebird as default promise', () => {
      assert.equal(UserSchema.collection.findOne().constructor, require('bluebird'));
    });
  });
});
