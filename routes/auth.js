var path        = require('path');
var mongoose    = require('mongoose');
var jwt         = require('koa-jwt');
var nconf       = require('nconf');

var prefix = '/' + path.basename(__filename).replace('.js', '');
var router = module.exports = require('koa-router')({prefix: prefix});

var User   = mongoose.model('User');


router
    .post('/signin', function *() {
        var username = this.request.body.username;
        var password = this.request.body.password;
        var user = yield User.authenticate(username, password, this);
        var token = jwt.sign(user, nconf.get('services:auth:jwt:secret'), { expiresInMinutes: 60 * 5 });
        this.body = {token: token};
    })

    .post('/signup', function *() {
        var user = new User(this.request.body);
        this.body = yield user.save();
        this.status = 201;
    })

    .post('/signout', function *() {
        delete this.state.user;
        this.status = 201;
    })

    .get('/profile', function *() {
        this.body = this.state.user;
    });
