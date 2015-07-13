module.exports = function(app) {
  var        _ = require('lodash');
  var config = require('../config/config.json');

  app.config = _.extend({permissions: require('../config/permissions')}, config['production'], config[app.env]);
  return function*(next) {
    this.config = app.config;
    yield next
  }
};
