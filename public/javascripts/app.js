var home = require('./views/home.js');
var $ = require('jquery');


$('.signin-btn').popover({
  content: 'jQuery shimmed',
  trigger: 'hover'
});

home();