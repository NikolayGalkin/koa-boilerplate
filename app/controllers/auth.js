"use strict";
let router = require('koa-router')({prefix: '/auth'});
let app    = require('../../app');
let User   = app.db.model('User');

module.exports = router.routes();

router
  .post('/signin', app.acl.can('auth:signin'), function*() {
    this.checkBody('email').notEmpty().isEmail('Invalid Email').trim().toLow();
    this.checkBody('password').notEmpty().len(6, 20).trim();
    if (this.errors) {
      this.throw(422, 'Invalid email or password');
    }

    let email = this.request.body.email;
    let password = this.request.body.password;
    let user = yield User.authenticate(email, password, this);
    let token = this.jwt.sign(user, this.config.auth.jwt.secret, {expiresInMinutes: 60 * 5});
    this.body = {token: token};
  })

  .post('/signup', app.acl.can('auth:signup'), function*() { // Duplicate of POST /users
    let user = new User(this.request.body);
    yield user.save();
    this.body = user;
    this.status = 201;
  })

  .post('/signout', app.acl.can('auth:signout'), function*() {
    delete this.state.user;
    this.status = 201;
  })

  .get('/profile', app.acl.can('auth:profile'), function*() {
    this.body = this.state.user;
  });
