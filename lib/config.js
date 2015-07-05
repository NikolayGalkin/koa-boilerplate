module.exports = function(app) {
  var        _ = require('lodash');
  var config = require('../config/config.json');

  app.config = _.extend({}, config['production'], config[app.env]);
  app.config.permissions = require('../config/permissions');
  return function*(next) {
    this.config = app.config;
    yield next
  }
};
