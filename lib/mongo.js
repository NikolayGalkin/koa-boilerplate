var nconf    = require('nconf');
var glob     = require('glob');
var mongoose = module.exports = require('mongoose');

mongoose.connect(nconf.get('services:mongo:uri'));
mongoose.connection.on('error', console.log);

glob.sync('../models/**.js', { cwd: __dirname }).forEach(require);

