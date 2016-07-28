const jwt = require('koa-jwt');

module.exports = app => {
  // @todo: remove unless
  app.use(jwt({ secret: process.env.AUTH_JWT_SECRET }).unless({ path: ['/auth/signin', '/auth/signup'] }));

  return function* (next) {
    this.jwt = jwt;
    yield next;
  };
};
