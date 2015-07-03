var nconf    = require('nconf');
var glob     = require('glob');
var CreateError = require('create-error');
var mongoose = module.exports = require('mongoose');

mongoose.connect(nconf.get('mongo:uri'));
mongoose.connection.on('error', console.error.bind(console));
mongoose.validation = require('./mongoose-validation');
mongoose.Error.InvalidIdError = CreateError('InvalidIdError', {status: 422});

glob.sync('../app/models/**.js', { cwd: __dirname }).forEach(require);
