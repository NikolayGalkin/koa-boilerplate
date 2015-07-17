"use strict";
let Resource = require('koa-resource-router');
let app      = require('../../app');
let User     = app.db.model('User');

module.exports = new Resource('users', {
  index: [app.acl.can('users:list'), function*() {
    this.body = yield User.find();
  }],
  create: [app.acl.can('users:create'), function*() {
    let user = new User(this.request.body);
    yield user.save();
    this.body = user;
    this.status = 201;
  }],
  show: [app.acl.can('users:show'), userParam, function*() {
    this.body = this.item;
  }],

  update: [app.acl.can('users:update'), userParam, function*() {
    this.request.body && delete this.request.body._id && delete this.request.body.email;
    yield this.item.set(this.request.body).save();
    this.body = this.item;
  }],
  destroy: [app.acl.can('users:destroy'), userParam, function*() {
    yield this.item.remove();
    this.status = 204;
  }]
}).middleware();


function *userParam(next) {
  this.checkParams('user').isObjectId();
  if (this.errors) {
    this.throw(422, 'Invalid User id')
  }
  this.item = yield this.db.model('User').findById(this.params.user);
  if (!this.item) {
    this.throw(404, 'User not found');
  }
  yield next
}
