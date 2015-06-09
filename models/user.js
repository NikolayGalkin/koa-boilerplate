var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

var schema = new mongoose.Schema({
    email: {type: String, index: { unique: true }},
    password: String
});

schema.statics.SALT_WORK_FACTOR = 10;

schema.pre('save', function(next) {
    var _this = this;

    if (!_this.isModified('password')) return next();

    bcrypt.genSalt(_this.SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(_this.password, salt, function(err, hash) {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    });
});

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);

};

schema.statics.authenticate = function *(username, password, app) {
    var user = yield this.findOne({email: username});
    if (!user) {
        app.throw(404)
    }

    var isValidPassword = user.comparePassword(password);
    if (!isValidPassword) {
        app.throw(400)
    }

    return user;
};

mongoose.model('User', schema);
