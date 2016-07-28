const _ = require('lodash');

module.exports = () => (
  function* (next) {
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
        this.body.errors = _.map(err.errors, error => {
          const { message, path } = error;
          return { message, path };
        });
      }
      if (this.errors) {
        this.body.errors = this.errors.map(error => {
          const path = Object.keys(error)[0];
          return {
            path,
            message: error[path]
          };
        });
      }
    }
  }
);
