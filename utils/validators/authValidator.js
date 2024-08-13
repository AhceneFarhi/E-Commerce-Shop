const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../model/User");




exports.SignUpValidator = [

    check('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({min:2})
    .withMessage('Too short name user must be at least 2 characters')
    .custom((val,{req})=>{
        req.body.slug =slugify(val)
        return true;
    }),

    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom((val) =>User.findOne({email:val}).then((user) =>{      // Email must be unique 
        if (user) {
            return Promise.reject(new Error('Email is already in user'))
        }
    })
),

check('password')
.notEmpty()
.withMessage('Password is required')
.isLength({min:6})
.withMessage("Password must be at least 6 characters")
.custom((password,{req})=>{
    if (req.body.passwordConfirm !== password) {
        throw new Error('Password Confirmation Failed')
    }
    return true
}),

check('passwordConfirm')
.notEmpty().withMessage('PasswordConfirm is required'),

    validatorMiddleware
]

exports.LoginValidator = [

    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),

check('password')
.notEmpty()
.withMessage('Password is required')
.isLength({min:6})
.withMessage("Password must be at least 6 characters"),


    validatorMiddleware
]






