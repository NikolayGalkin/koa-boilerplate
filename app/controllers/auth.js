const router = require('koa-router')({ prefix: '/auth' });
const app = require('../../app');

const User = app.db.model('User');
module.exports = router.routes();

router
  .post('/signin', app.acl.can('auth:signin'), function* sigin() {
    this.checkBody('email').notEmpty().isEmail('Invalid Email').trim().toLow();
    this.checkBody('password').notEmpty().len(6, 20).trim();
    if (this.errors) {
      this.throw(422, 'Invalid email or password');
    }

    const email = this.request.body.email;
    const password = this.request.body.password;
    const user = yield User.authenticate(email, password, this);
    const token = this.jwt.sign(user, this.config.auth.jwt.secret, { expiresInMinutes: 60 * 5 });
    this.body = { token };
  })

  .post('/signup', app.acl.can('auth:signup'), function* signup() { // Duplicate of POST /users
    const user = new User(this.request.body);
    yield user.save();
    this.body = user;
    this.status = 201;
  })

  .post('/signout', app.acl.can('auth:signout'), function* signout() {
    delete this.state.user;
    this.status = 201;
  })

  .get('/profile', app.acl.can('auth:profile'), function* profile() {
    this.body = this.state.user;
  });
