var app = module.exports = require('koa')();

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());
app.use(require('koa-cors')());
app.use(require('koa-validate')());

app.use(require('./lib/response')());
app.use(require('./lib/config')(app));
app.use(require('./lib/jwt')(app));
app.use(require('./lib/mongo')());
app.use(require('./lib/validation')());
app.use(require('./lib/acl')());

app.use(require('./app/controllers/users'));
app.use(require('./app/controllers/auth'));


if (!module.parent) {
    app.listen(app.config.app.port, app.config.app.host, function () {
        console.log('Listen on: ' + app.config.app.host + ':' + app.config.app.port);
    });
}
