"use strict";
module.exports = function(app) {
  let Roles       = require('koa-roles');
  let _           = require('lodash');
  let permissions = require('../config/permissions');

  _.forEach(permissions, function(permission, role) {
    if (!_.isArray(permission)) {
      permissions[role] = permission.permissions.concat(permissions[permission.extend]);
    }
  });

  let acl = new Roles({
    failureHandler: function *(action) {
      this.throw(403, `Access forbidden for: ${action}`);
    }
  });

  acl.use(function *(action) {
    // admin
    var role = this.state.user && this.state.user.role;
    if (role === 'admin') {
      return true
    }

    // guest
    if (!this.state.user && ~permissions.guest.indexOf(action)) {
      return true
    }

    // others
    if (role && ~permissions[role].indexOf(action)) {
      return true
    }
  });

  app.acl = acl;
  app.use(acl.middleware());
  return function*(next) {
    yield next;
  }
};
