var koa         = require('koa');
var logger      = require('koa-logger');
var bodyParser  = require('koa-bodyparser');
var cors        = require('koa-cors');
var nconf       = require('nconf');

var app = koa();

app.services = require('./boot');

app.use(logger());
app.use(bodyParser());
app.use(cors());

app.use(require('./routes/users').routes());


// error handler
app.use(function *errorHandler(next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;
        this.message = err.message || this.message || 'Server Error';
        this.app.emit('error', err, this);
    }
});

app.on('error', function(err) {
    console.error('Server error: ' + err.message);
});


app.listen(nconf.get('app:port'), nconf.get('app:host'), function () {
    console.log('Listen on: ' + nconf.get('app:host') + ':' + nconf.get('app:port'));
});
