'use strict';

module.exports = {
  app: {
    title: 'Express App',
    description: 'Full-Stack Javascript Application',
    keywords: 'mongodb, express, node.js, mongoose, gulp, browserify, passport'
  },
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET,
  sessionCollection: 'sessions',
  assets: {
    lib: {
      css: [
        './public/bower_components/bootstrap/dist/css/bootstrap.css',
        './public/bower_components/bootstrap/dist/css/bootstrap-theme.css',
        './public/bower_components/font-awesome/css/font-awesome.css'
      ],
      js: [
        'public/bower_components/jquery/dist/jquery.js',
        'public/bower_components/bootstrap/dist/js/bootstrap.js'
      ]
    },
    css: [
      'public/stylesheets/main.css'
    ],
    js: [
      'public/dist/js/app.min.js',
      'public/javascripts/*/*[!tests]*/*.js'
    ],
    tests: [
      'public/tests/**/*.js'
    ]
  }
};