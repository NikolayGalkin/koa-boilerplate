module.exports = function(app) {
  app.config = require('../config/config.json');
  app.config.permissions = require('../config/permissions');
  return function *(next) {
    this.config = app.config;
    yield next
  }
};
