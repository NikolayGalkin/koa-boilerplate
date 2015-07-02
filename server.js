var koa         = require('koa');
var logger      = require('koa-logger');
var bodyParser  = require('koa-bodyparser');
var cors        = require('koa-cors');
var jwt         = require('koa-jwt');
var validate    = require('koa-validate');
var nconf       = require('nconf');
var mongoose    = require('mongoose');
var router      = require('./lib/router');
var _           = require('lodash');


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
            name: err.name,
            status: err.status || 500,
            message: err.message || 'Internal Error'
        };
        if (err.errors) {
            this.body.errors = _.map(err.errors, function(error) {
                return _.pick(error, 'message', 'kind', 'path');
            })
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
app.use(require('./app/controllers/users').middleware());

//app.on('error', function(err) {
//    console.error('Server error: ' + err.stack);
//});


app.listen(nconf.get('app:port'), nconf.get('app:host'), function () {
    console.log('Listen on: ' + nconf.get('app:host') + ':' + nconf.get('app:port'));
});
