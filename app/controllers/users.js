var mongoose = require('mongoose');
var User     = mongoose.model('User');

module.exports = {

    prefix: '',
    path: '/users',

    param: function *(id, next) {
        //if (!mongoose.Types.ObjectId.isValid(id)) { // @todo: try to catch CastError without own exception
        //    this.throw(new mongoose.Error.InvalidIdError('Invalid User ID'));
        //}
        this.item = yield User.findOne({_id: id});
        if (!this.item) {
            this.throw(404, 'User not found');
        }
        yield next
    },

    list: function *() {
        this.body = yield User.find().exec();
    },

    create: function *() {
        var user = new User(this.request.body);
        yield user.save();
        this.body = user;
        this.status = 201;
    },

    detail: function *() {
        this.body = this.item;
    },

    update: function *() {
        this.request.body && delete this.request.body._id;
        yield this.item.set(this.request.body).save();
        this.body = this.item;
    },

    remove: function *() {
        yield this.item.remove();
        this.status = 204;
    }
};