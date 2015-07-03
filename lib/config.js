module.exports.middleware = function() {
    return function *(next) {
        this.config = require('../config/config.json');
        yield next
    }
};

module.exports.config = require('../config/config.json');