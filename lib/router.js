const glob = require('glob');

module.exports = app => {
  glob
    .sync('../app/controllers/*.js', { cwd: __dirname })
    .map(require)
    .forEach(app.use.bind(app));

  return function* (next) {
    yield next;
  };
};
