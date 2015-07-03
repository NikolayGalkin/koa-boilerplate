module.exports = function(app) {
    app.config = require('../config/config.json');
    return function *(next) {
        this.config = app.config;
        yield next
    }
};
