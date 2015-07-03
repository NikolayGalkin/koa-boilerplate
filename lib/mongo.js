module.exports = function(app) {
    var mongoose    = require('mongoose');
    var glob        = require('glob');
    var validate    = require('mongoose-validator');

    var validation = {
        emailValidator: [
            validate({
                validator: 'isEmail'
            })
        ],
        firstNameValidator: [
            validate({
                validator: 'isAlpha',
                message: 'First Name should contains only Alpha characters'
            }),
            validate({
                validator: 'isLength',
                arguments: [3, 15],
                message: 'First Name should be between {ARGS[0]} and {ARGS[1]} characters'
            })
        ],
        lastNameValidator: [
            validate({
                validator: 'isAlpha',
                message: 'Last Name should contains only Alpha characters'
            }),
            validate({
                validator: 'isLength',
                arguments: [3, 25],
                message: 'Last Name should be between {ARGS[0]} and {ARGS[1]} characters'
            })
        ]
    };

    mongoose.connect(app.config.mongo.uri);
    mongoose.validation = validation;
    glob.sync('../app/models/**.js', { cwd: __dirname }).forEach(require);

    return function *(next) {
        this.db = mongoose;
        yield next
    };
};
