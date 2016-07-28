const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const ROLE_GUEST = 'guest';
const ROLE_USER = 'user';
const ROLE_ADMIN = 'admin';
const ROLES = [ROLE_GUEST, ROLE_USER, ROLE_ADMIN];

const schema = new mongoose.Schema({
  /**
   * @param {{validation:object}} mongoose
   */
  email: { type: String, trim: true, required: true, unique: true, validate: mongoose.validation.emailValidator },
  password: { type: String, trim: true, required: true, select: false },
  role: { type: String, trim: true, required: true, default: ROLE_USER, enum: ROLES },
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true }
});

schema.plugin(timestamps, { createdAt: 'created', updatedAt: 'updated' });
schema.plugin(uniqueValidator, 'Error, expected {PATH} to be unique');

schema.pre('save', function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    return next();
  });
});

schema.statics.authenticate = function* authenticate(email, password, app) {
  const user = yield this.findOne({ email }).select('email password role firstName lastName').exec();
  if (!user) {
    app.throw(422, 'Wrong email of password');
  }
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    app.throw(422, 'Wrong email of password');
  }
  return user;
};

mongoose.model('User', schema);
