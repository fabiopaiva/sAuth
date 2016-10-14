var request = require('supertest');
var app = require('../src/index');
var jwt = require('jsonwebtoken');

describe('Routes', () => {
  describe('#Getting ping response', () => {
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

  describe('#User requests', () => {
    describe('#Create', () => {
      it('should create an user', (done) => {
        var token = jwt.sign({ }, process.env.SECRET);
        request(app)
          .put('/user')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: 'Fábio Paiva',
            email: 'fabio@paiva.info',
            username: 'fabio',
            password: 'fabio',
            provider: 'local'
          })
          .expect(201, done);
      });
    });

    describe('#Authenticate fail', () => {
      it('should fail an authentication for the user', (done) => {
        request(app)
          .post('/authenticate')
          .send({
            username: 'fabio',
            password: 'fake',
            provider: 'local'
          })
          .expect(401, done);
      });
    });

    describe('#Authenticate success', () => {
      it('should authenticate the user', (done) => {
        request(app)
          .post('/authenticate')
          .send({
            username: 'fabio',
            password: 'fabio',
            provider: 'local'
          })
          .expect(200)
          .expect((res) => {
            if (!('access_token' in res.body)) throw new Error("missing access token");
            if (!('refresh_token' in res.body)) throw new Error("missing refresh token");
          })
          .end(done);
      });
    });
  });
});
