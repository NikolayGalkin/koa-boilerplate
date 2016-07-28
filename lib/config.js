const config = require('../config/config.json');
const permissions = require('../config/permissions');

module.exports = app => {
  app.config = Object.assign({ permissions }, config.production, config[app.env]);
  return function* (next) {
    this.config = app.config;
    yield next;
  };
};
