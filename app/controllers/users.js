"use strict";
let Resource = require('koa-resource-router');
let _        = require('lodash');
let app      = require('../../app');
let User     = app.db.model('User');

module.exports = new Resource('users', {
  index: [app.acl.can('users:list'), function*() {
    this.body = yield User.find({}, {__v: false, password: false});
  }],

  create: [app.acl.can('users:create'), function*() {
    this.checkBody('email').notEmpty().isEmail('Invalid Email').trim().toLow();
    this.checkBody('password').notEmpty().len(6, 20).trim();
    this.checkBody('firstName').notEmpty().isAlpha().trim();
    this.checkBody('lastName').notEmpty().isAlpha().trim();
    if (this.errors) {
      this.throw(422, 'Invalid params');
    }

    let params = _.pick(this.request.body, ['email', 'password', 'firstName', 'lastName', 'role']);
    let user = new User(params);
    yield user.save();
    this.body = user;
    this.status = 201;
  }],

  show: [app.acl.can('users:show'), userParam, function*() {
    this.body = this.item;
  }],

  update: [app.acl.can('users:update'), userParam, function*() {
    this.checkBody('password').notEmpty().len(6, 20).trim();
    this.checkBody('firstName').notEmpty().isAlpha().trim();
    this.checkBody('lastName').notEmpty().isAlpha().trim();
    if (this.errors) {
      this.throw(422, 'Invalid params');
    }

    let params = _.pick(this.request.body, ['password', 'firstName', 'lastName', 'role']);
    yield this.item.set(params).save();
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

  this.item = yield User.findById(this.params.user);
  if (!this.item) {
    this.throw(404, 'User not found');
  }
  yield next
}
