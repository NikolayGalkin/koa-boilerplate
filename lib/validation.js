const Validator = require('koa-validate').Validator;
const validator = require('validator');

module.exports = () => {
  Validator.prototype.isObjectId = function isObjectId(tip) {
    if (this.goOn && !validator.isMongoId(this.value)) {
      this.addError(tip || 'id param is not id');
    }
    return this;
  };

  return function* (next) {
    yield next;
  };
};
