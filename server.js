var koa         = require('koa');
var jwt         = require('koa-jwt');
var _           = require('lodash');
var config      = require('./lib/config');

var app = koa();


// error handler
app.use(function *errorHandler(next) {
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
                var path = Object.keys(error)[0];
                return {
                    path: path,
                    message: error[path]
                };
            })
        }
    }
});

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());
app.use(require('koa-cors')());
app.use(require('koa-validate')());

app.use(jwt({secret: config.config.auth.jwt.secret}).unless({path: ['/auth/signin', '/auth/signup']}));

app.use(config.middleware());
app.use(require('./lib/mongo')());
app.use(require('./lib/app-validation')());
app.use(require('./lib/acl')());

app.use(require('./app/controllers/users').middleware());
app.use(require('./app/controllers/auth').routes());

app.listen(config.config.app.port, config.config.app.host, function () {
    console.log('Listen on: ' + config.config.app.host + ':' + config.config.app.port);
});
