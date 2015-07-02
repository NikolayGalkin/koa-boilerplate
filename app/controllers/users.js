var Resource = require('koa-resource-router');
var mongoose = require('mongoose');
var User     = mongoose.model('User');

function *userParam(next) {
    if (!this.params.user) {
        return yield next;
    }
    this.item = yield User.findById(this.params.user);
    if (!this.item) {
        this.throw(404, 'User not found');
    }
    yield next
}


module.exports = new Resource('users', {
    index: function *() {
        this.body = yield User.find().exec();
    },
    create: function *() {
        var user = new User(this.request.body);
        yield user.save();
        this.body = user;
        this.status = 201;
    },
    show: [userParam, function *() {
        this.body = this.item;
    }],

    update: [userParam, function *() {
        this.request.body && delete this.request.body._id && delete this.request.body.email;
        yield this.item.set(this.request.body).save();
        this.body = this.item;
    }],
    destroy: [userParam, function *() {
        yield this.item.remove();
        this.status = 204;
    }]
});
