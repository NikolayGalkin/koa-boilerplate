module.exports = function() {
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

    return function *(next) {
        this.db = mongoose;
        if (mongoose.Connection.STATES.connected === mongoose.connection.readyState) {
            return yield next;
        }
        mongoose.connect(this.config.mongo.uri);
        mongoose.validation = validation;
        glob.sync('../app/models/**.js', { cwd: __dirname }).forEach(require);

        yield next
    };
};
