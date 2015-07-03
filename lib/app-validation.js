var v         = require('validator');
var Validator = require('koa-validate').Validator;

Validator.prototype.isObjectId = function(tip) {
    if (this.goOn && !v.isMongoId(this.value)) {
        this.addError(tip || 'id param is not id');
    }
    return this;
};