module.exports = function(app) {
  var mongoose    = require('mongoose');
  var glob        = require('glob');
  var validate    = require('mongoose-validator');

  var validation = {
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
