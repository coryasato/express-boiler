'use strict';

module.exports = function(app) {
  var index = require('../controllers/index.controller.js');
  app.route('/').get(index.index);

  app.route('/login').get(index.login);

  app.route('/signup').get(index.signup);
};
