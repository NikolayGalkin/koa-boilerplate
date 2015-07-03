var Resource = require('koa-resource-router');


module.exports = new Resource('users', {
    index: function *() {
        this.body = yield this.db.model('User').find();
    },
    create: function *() {
        var user = new this.db.model('User')(this.request.body);
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
