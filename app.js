const app = module.exports = require('koa')();

require('dotenv').config();

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());
app.use(require('koa-cors')());
require('koa-validate')(app);

app.use(require('./lib/response')());
app.use(require('./lib/mongo')(app));
app.use(require('./lib/jwt')(app));
app.use(require('./lib/acl')(app));
app.use(require('./lib/validation')());
app.use(require('./lib/router')(app));

if (!module.parent) {
  app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Listen on: ${process.env.APP_HOST}:${process.env.APP_PORT}`);
  });
}
