"use strict";
module.exports = function() {
  let _ = require('lodash');

  return function*(next) {
    try {
      yield next;
      this.body = {
        success: true,
        status: this.status,
        result: this.body
      };
      this.status = 200;
    } catch (err) {
      this.status = 200;
      this.body = {
        success: false,
        name: err.name,
        status: err.status || 500,
        message: err.message || 'Internal Error',
        stack: this.app.env === 'development' ? err.stack : ''
      };
      if (err.errors) {
        this.body.errors = err.errors.map(function(error) {
          return _.pick(error, 'message', 'path');
        })
      }
      if (this.errors) {
        this.body.errors = this.errors.map(function(error) {
          let path = Object.keys(error)[0];
          return {
            path: path,
            message: error[path]
          };
        })
      }
    }
  }
};
