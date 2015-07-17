"use strict";
module.exports = function(app) {
  let        _ = require('lodash');
  let config = require('../config/config.json');

  app.config = _.extend({permissions: require('../config/permissions')}, config['production'], config[app.env]);
  return function*(next) {
    this.config = app.config;
    yield next
  }
};
