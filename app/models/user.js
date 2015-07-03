var mongoose        = require('mongoose');
var timestamps      = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt          = require('bcrypt');

var schema = new mongoose.Schema({
    email:      {type: String, trim: true, required: true, unique: true, validate: mongoose.validation.emailValidator},
    password:   {type: String, trim: true, required: true},
    firstName:  {type: String, trim: true, required: true, validate: mongoose.validation.firstNameValidator},
    lastName:   {type: String, trim: true, required: true, validate: mongoose.validation.lastNameValidator}
});

schema.plugin(timestamps, {createdAt: 'created', updatedAt: 'updated'});
schema.plugin(uniqueValidator, 'Error, expected {PATH} to be unique');

schema.pre('save', function(next) {
    var _this = this;
    if (!_this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        _this.password = hash;
        next()
    });
});

schema.statics.authenticate = function *(email, password, app) {
    var user = yield this.findOne({email: email});
    if (!user) {
        app.throw(422, 'Wrong email of password');
    }
    var isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
        app.throw(422, 'Wrong email of password');
    }
    return user;
};

mongoose.model('User', schema);
