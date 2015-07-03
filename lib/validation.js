module.exports = function() {
  var Validator = require('koa-validate').Validator;
  var v         = require('validator');

  Validator.prototype.isObjectId = function(tip) {
    if (this.goOn && !v.isMongoId(this.value)) {
      this.addError(tip || 'id param is not id');
    }
    return this;
  };

  return function*(next) {
    yield next;
  }
};
