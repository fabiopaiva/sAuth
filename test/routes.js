var request = require('supertest');
var app = require('../src/index');

describe('Routes', () => {
  describe('Getting ping response', () => {
    it('should return a timestamp with 13 digits and status 200', (done) => {
      request(app)
        .get('/ping')
        .expect(function(res) {
          res.body.length = res.body.time.toString().length;
          delete res.body.time;
        })
        .expect(200, {
          length: 13
        }, done);
    });
  });
});
