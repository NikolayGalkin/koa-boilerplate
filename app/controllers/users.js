const Resource = require('koa-resource-router');
const app = require('../../app');

const User = app.db.model('User');

function* userParam(next) {
  this.checkParams('user').isObjectId();
  if (this.errors) {
    this.throw(422, 'Invalid User id');
  }

  this.item = yield User.findById(this.params.user);
  if (!this.item) {
    this.throw(404, 'User not found');
  }
  yield next;
}


module.exports = new Resource('users', {
  index: [ /* app.acl.can('users:list') ,*/ function* index() {
    this.body = yield User.find({}, { __v: false, password: false });
  }],

  create: [app.acl.can('users:create'), function* create() {
    this.checkBody('email').notEmpty().isEmail('Invalid Email').trim().toLow();
    this.checkBody('password').notEmpty().len(6, 20).trim();
    this.checkBody('firstName').notEmpty().isAlpha().trim();
    this.checkBody('lastName').notEmpty().isAlpha().trim();
    if (this.errors) {
      this.throw(422, 'Invalid params');
    }

    // const params = _.pick(this.request.body, ['email', 'password', 'firstName', 'lastName', 'role']);
    const { email, password, firstName, lastName, role } = this.request.body;
    const user = new User({ email, password, firstName, lastName, role });
    yield user.save();
    this.body = user;
    this.status = 201;
  }],

  show: [app.acl.can('users:show'), userParam, function* show() {
    this.body = this.item;
  }],

  update: [app.acl.can('users:update'), userParam, function* update() {
    this.checkBody('password').notEmpty().len(6, 20).trim();
    this.checkBody('firstName').notEmpty().isAlpha().trim();
    this.checkBody('lastName').notEmpty().isAlpha().trim();
    if (this.errors) {
      this.throw(422, 'Invalid params');
    }

    const { password, firstName, lastName, role } = this.request.body;
    // let params = _.pick(this.request.body, ['password', 'firstName', 'lastName', 'role']);
    yield this.item.set({ password, firstName, lastName, role }).save();
    this.body = this.item;
  }],

  destroy: [app.acl.can('users:destroy'), userParam, function* destroy() {
    yield this.item.remove();
    this.status = 204;
  }]
}).middleware();
