var path        = require('path');
var mongoose    = require('mongoose');
var _           = require('lodash');

var prefix = '/' + path.basename(__filename).replace('.js', '');
var router = module.exports = require('koa-router')({prefix: prefix});

var User   = mongoose.model('User');


router
    .param('id', function *(id, next) {
        try {
            this.item = yield User.findOne({_id: mongoose.Types.ObjectId(id)});
        } catch (e) {
            this.throw(400);
        }
        if (!this.item) {
            this.throw(404);
        }
        yield *next;
    })

    .get('/', function *() {
        this.body = yield User.find()
    })

    .post('/', function *() {
        this.body = yield User.create(this.request.body);
        this.status = 201;
    })

    .get('/:id', function *() {
        this.body = this.item;
    })

    .put('/:id', function *() {
        this.request.body && delete this.request.body._id && _.extend(this.item, this.request.body);
        this.body = yield this.item.save();
        this.status = 202;
    })

    .patch('/:id', function *() {
        this.request.body && delete this.request.body._id && _.extend(this.item, this.request.body);
        this.body = yield this.user.save();
        this.status = 202;
    })

    .del('/:id', function *() {
        yield this.item.remove();
        this.status = 204;
    });
