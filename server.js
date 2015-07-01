var koa         = require('koa');
var logger      = require('koa-logger');
var bodyParser  = require('koa-bodyparser');
var cors        = require('koa-cors');
var jwt         = require('koa-jwt');
var validate    = require('koa-validate');
var nconf       = require('nconf');
var mongoose    = require('mongoose');
var _           = require('lodash');
var errors      = require('./lib/errors');
var router      = require('./lib/router');


var app = koa();

app.services = require('./boot');

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
            name:    err.name,
            status:  err.status || 500,
            message: err.message || 'Internal Error',
            errors:  err.errors
        };
        //if (err instanceof this.errs.InvalidParamsError) {
        //    this.body.status  = 422;
        //    this.body.name    = err.name;
        //    this.body.message = err.message;
        //    this.body.errors  = err.errors;
        //}
        if (err instanceof mongoose.Error.ValidationError) {
            errors = _.map(err.errors, function(error) {
                return _.pick(error, 'message', 'kind', 'path');
            });
            this.body.status  = 422;
            this.body.name    = err.name;
            this.body.message = err.message;
            this.body.errors  = errors;
        }
    }
});

// @todo
// remove unless
//app.use(jwt({secret: nconf.get('auth:jwt:secret') }).unless({path: ['/auth/signin', '/auth/signup']}));

app.use(logger());
app.use(bodyParser());
app.use(cors());
app.use(validate());
app.use(errors());
app.use(router({controllersPath: '../app/controllers'}));

//app.on('error', function(err) {
//    console.error('Server error: ' + err.stack);
//});


app.listen(nconf.get('app:port'), nconf.get('app:host'), function () {
    console.log('Listen on: ' + nconf.get('app:host') + ':' + nconf.get('app:port'));
});
