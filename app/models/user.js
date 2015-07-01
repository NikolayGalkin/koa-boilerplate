var mongoose   = require('mongoose');
var timestamps = require('mongoose-timestamp');

var schema = new mongoose.Schema({
    email:      {type: String, trim: true, required: true, validate: mongoose.validation.emailValidator},
    password:   {type: String, trim: true, required: true},
    firstName:  {type: String, trim: true, required: true, validate: mongoose.validation.firstNameValidator},
    lastName:   {type: String, trim: true, required: true, validate: mongoose.validation.lastNameValidator},
});

schema.plugin(timestamps, {createdAt: 'created', updatedAt: 'updated'});

schema.path('email').validate(function(value, next) {
    if (!this.isModified(value)) {
        return next(true);
    }
    this.findOne({email: value}, function(err, item) {
        next(item == null);
    })
}, 'Email already in use');

mongoose.model('User', schema);
