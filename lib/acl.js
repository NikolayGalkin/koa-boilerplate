var ACL     = require('acl');
var Promise = require('bluebird');
var acl     = new ACL(new ACL.memoryBackend());

// @todo: do it better

acl.allow([
    {
        roles: 'guest',
        allows: [
            {resources: ['auth/signin', 'auth/signup'], permissions: 'post'}
        ]
    },
    {
        roles: 'user',
        allows: [
            {resources: ['/users'], permissions: 'get'}
        ]
    },
    {
        roles: 'admin',
        allows: [
            {resources: ['users'], permissions: '*'}
        ]
    }
]);

acl.addRoleParents( 'user', 'guest' );
acl.addRoleParents( 'admin', 'user' );

module.exports = function() {
    return function *(next) {
        // todo: do it better. Maybe move to config
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
