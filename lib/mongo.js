"use strict";
module.exports = function(app) {
  let mongoose    = require('mongoose');
  let glob        = require('glob');
  let validate    = require('mongoose-validator');

  let validation = {
    emailValidator: [
      validate({
        validator: 'isEmail'
      })
    ]
  };

  app.db = mongoose;
  mongoose.connect(app.config.mongo.uri);
  mongoose.validation = validation;
  glob.sync('../app/models/**.js', {cwd: __dirname}).forEach(require);

  return function*(next) {
    this.db = mongoose;
    yield next
  };
};
