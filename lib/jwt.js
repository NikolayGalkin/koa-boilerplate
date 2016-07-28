const jwt = require('koa-jwt');

module.exports = app => {
  // @todo: remove unless
  app.use(jwt({ secret: app.config.auth.jwt.secret }).unless({ path: ['/auth/signin', '/auth/signup'] }));

  return function* (next) {
    this.jwt = jwt;
    yield next;
  };
};
