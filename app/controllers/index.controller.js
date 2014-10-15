'use strict';

exports.index = function(req, res) {
  res.render('index', {
    user: req.user || null
  });
};

exports.login = function(req, res) {
  res.render('login');
};

exports.signup = function(req, res) {
  res.render('signup');
};