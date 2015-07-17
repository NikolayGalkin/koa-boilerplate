"use strict";
let mongoose        = require('mongoose');
let timestamps      = require('mongoose-timestamp');
let uniqueValidator = require('mongoose-unique-validator');
let bcrypt          = require('bcrypt');

const ROLE_GUEST = 'guest';
const ROLE_USER = 'user';
const ROLE_ADMIN = 'admin';
const ROLES = [ROLE_GUEST, ROLE_USER, ROLE_ADMIN];

let schema = new mongoose.Schema({
  /**
   * @param {{validation:object}} mongoose
   */
  email: {type: String, trim: true, required: true, unique: true, validate: mongoose.validation.emailValidator},
  password: {type: String, trim: true, required: true, select: false},
  role: {type: String, trim: true, required: true, default: ROLE_USER, enum: ROLES},
  firstName: {type: String, trim: true, required: true},
  lastName: {type: String, trim: true, required: true}
});

schema.plugin(timestamps, {createdAt: 'created', updatedAt: 'updated'});
schema.plugin(uniqueValidator, 'Error, expected {PATH} to be unique');

schema.pre('save', function(next) {
  let _this = this;
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

schema.statics.authenticate = function*(email, password, app) {
  let user = yield this.findOne({email: email});
  if (!user) {
    app.throw(422, 'Wrong email of password');
  }
  let isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    app.throw(422, 'Wrong email of password');
  }
  return user;
};

mongoose.model('User', schema);
