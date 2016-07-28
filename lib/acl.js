const Roles = require('koa-roles');
const _ = require('lodash');
const permissions = require('../config/permissions');

module.exports = app => {
  _.forEach(permissions, (permission, role) => {
    if (!_.isArray(permission)) {
      permissions[role] = permission.permissions.concat(permissions[permission.extend]);
    }
  });

  const acl = new Roles({
    failureHandler: function* failureHandler(action) {
      this.throw(403, `Access forbidden for: ${action}`);
    }
  });

  acl.use(function* middleware(action) {
    // admin
    const role = this.state.user && this.state.user.role;
    if (role === 'admin') {
      return true;
    }

    // guest
    if (!this.state.user && ~permissions.guest.indexOf(action)) {
      return true;
    }

    // others
    if (role && ~permissions[role].indexOf(action)) {
      return true;
    }
  });

  app.acl = acl;
  app.use(acl.middleware());
  return function* response(next) {
    yield next;
  };
};
