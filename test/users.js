var assert = require('assert'),
  UserModel = require('../src/model/user');

describe('Users persistence', () => {
  describe('Should manipulate an user with main CRUD operations', () => {
    before((done) => {
      require('../src/mongoose-setup')();
       UserModel.remove({}).then(() => {
         done();
       });
    });

    it('Should create user Fábio', (done) => {
      var user = new UserModel({
        name: 'Fábio Paiva',
        email: 'fabio@paiva.info',
        username: 'fabiopaiva',
        password: 'fabio',
        provider: 'local'
      });
      user.save()
        .then(user => {done();})
        .catch(err => {
          throw err;
        });
    });

    it('Should not create user with duplicated email', (done) => {
      var user = new UserModel({
        name: 'Fábio Paiva',
        email: 'fabio@paiva.info',
        username: 'fabio',
        password: 'fabio',
        provider: 'local'
      });
      user.save()
        .catch(err => {
          done();
        });
    });

    it('Should recover user Fábio and check password is encrypted', () => {
      UserModel.findOne({email: 'fabio@paiva.info'}).then((user) => {
        user.comparePassword('fabio', (err, isMatch) => {
          if (err) throw err;
          assert.ok(isMatch);
        });
      });
    });

    it('Should update user Fábio', (done) => {
      UserModel.findOne({email: 'fabio@paiva.info'}).exec().then((user) => {
        user.provider = 'local';
         user.save().then((data) => {
           assert.equal(data.provider, 'local');
           done();
         });
      });
    });

    it('Should remove user Fábio', (done) => {
       UserModel.remove({email: 'fabio@paiva.info'}, done);
    });

  });
});
