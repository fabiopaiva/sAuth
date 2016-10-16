var request = require('supertest'),
  app = require('../src/index'),
  jwt = require('jsonwebtoken'),
  UserModel = require('../src/model/user');

describe('Routes', () => {

  before((done) => {
    UserModel.remove({}, (err) => {
      console.log(err);
      done();
    });
  });

  describe('#Getting ping response', () => {
    it('should return a timestamp with 13 digits and status 200', (done) => {
      var token = jwt.sign({ }, process.env.SECRET);
      request(app)
        .get('/ping')
        .set('Authorization', 'Bearer ' + token)
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

    it('should remove created user', (done) => {
      let removeUser = (user) => {
        var token = jwt.sign({ }, process.env.SECRET);
        request(app)
          .delete('/user/' + user.id)
          .set('Authorization', 'Bearer ' + token)
          .send()
          .expect(204, done);
      };
      UserModel.findOne({email: 'fabio@paiva.info'}).then(removeUser);
    });
  });

  describe('#Authentication', () => {
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

      it('should fail to create an user without authentication', (done) => {
      request(app)
        .put('/user')
        .send({})
        .expect(401, done);
    });
    });
});
