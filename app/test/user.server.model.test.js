'use strict';

process.env.NODE_ENV = 'test';

require('must');
var User   = require('../models/user.server.model.js');

var user, user2;

describe('User Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    });
    user2 = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    });
    done();
  });

  describe('Method Save', function() {
    it('must begin with no users', function(done) {
      User.find({}, function(err, users) {
        users.must.have.length(0);
        done();
      });
    });

    it('must be able to save', function(done) {
      user.save(done);
    });

    it('must fail to save an exising user', function(done) {
      user.save();
      return user2.save(function(err) {
        err.must.exist();
        done();
      });
    });

    it('must show an error when saving without first name', function(done) {
      user.firstName = '';
      return user.save(function(err) {
        err.must.exist();
        done();
      });
    });
  });

  afterEach(function(done) {
    User.remove().exec();
    done();
  });
});

