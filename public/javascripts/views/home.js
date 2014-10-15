var $ = require('jquery');

module.exports = function () {
  $('.signup-btn').popover({
    content: 'Browserify is compiling!',
    trigger: 'hover'
  });
};