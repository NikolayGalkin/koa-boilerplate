// @todo: do it better
module.exports = function(app) {
  var ACL     = require('acl');
  var Promise = require('bluebird');
  var acl     = new ACL(new ACL.memoryBackend());

  acl.allow(app.config.permissions);
  acl.addRoleParents('user', 'guest');
  acl.addRoleParents('admin', 'user');

  return function*(next) {
    // @todo: do it better. Maybe move to config
    if (~['/auth/signin', '/auth/signup'].indexOf(this.request.url)) {
      return yield next
    }
    acl.addUserRoles(this.state.user.email, this.state.user.role);
    var check     = Promise.promisify(acl.isAllowed, acl);
    var isAllowed = yield check(this.state.user.email, this.request.url, this.request.method.toLowerCase());
    if (!isAllowed) {
      this.throw(403);
    }
    yield next
  }
};
