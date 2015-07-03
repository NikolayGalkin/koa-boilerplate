module.exports = function(app) {
    var jwt = require('koa-jwt');
    app.use(jwt({secret: app.config.auth.jwt.secret}).unless({path: ['/auth/signin', '/auth/signup']}))

    return function *(next) {
        this.jwt = jwt;
        yield next
    }
};
