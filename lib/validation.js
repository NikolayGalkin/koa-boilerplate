var validate = require('mongoose-validator');

var v = module.exports;

v.emailValidator = [
    validate({
        validator: 'isEmail'
    })
];

v.firstNameValidator = [
    validate({
        validator: 'isAlpha',
        message: 'First Name should contains only Alpha characters'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 15],
        message: 'First Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

v.lastNameValidator = [
    validate({
        validator: 'isAlpha',
        message: 'Last Name should contains only Alpha characters'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Last Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];