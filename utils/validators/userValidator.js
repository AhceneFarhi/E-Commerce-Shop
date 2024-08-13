const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../model/User");
const bcrypt = require("bcryptjs");




exports.createUserValidator = [

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

check('phone').optional().isMobilePhone(["ar-DZ","ar-EG"]),

check('profileImage').optional(),

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


exports.getUserValidator=[
    check('id').isMongoId().withMessage('Invalid user id format'), 

    validatorMiddleware
]


exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid user id format'), 
     body('name')
     .optional()
     .custom((val,{req})=>{
        req.body.slug = slugify(val);
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
 
 check('phone').optional().isMobilePhone(["ar-DZ","ar-EG"]),
 
 check('profileImage').optional(),
 

     validatorMiddleware
]


exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid user id format'), 
]


exports.changePasswordValidator = [
    check('id').isMongoId().withMessage('Invalid user Id format'),
    body("currentPassword").notEmpty().withMessage(' Current password is required'),

    body("passwordConfirm").notEmpty().withMessage('passwordConfirm is required'),

    body("password")
    .notEmpty()
    .withMessage('Password is required').custom(async(val,{req})=>{
        // 1- verify the current password
        const user = await User.findById(req.params.id)
        if (!user) {
            throw new Error('User not found')
        }
        const isCorrect = await bcrypt.compare(req.body.currentPassword, user.password)

        if (!isCorrect) {
            throw new Error('Incorrect currnet password')
        }

        // 2- Verification password confirm
        if (val!==req.body.passwordConfirm) {
            throw new Error('Invalid password Confirm')
        }

         return true;
    }),

    validatorMiddleware
]

exports.changeMyPasswordValidator = [
    body("oldPassword")
    .notEmpty().withMessage("Please enter your old password")
    .custom(async(oldPassword,{req})=>{
        const isCorrect = await bcrypt.compare(oldPassword,req.user.password)
          if (!isCorrect) {
            throw new Error('Incorrect currnet password')
          }
          return true
    }),

    body('newPassword')
    .notEmpty().withMessage("Please enter your new password")
    .isLength({min:6}).withMessage("New password must be at least 6 characters")
    .custom((newPassword,{req})=>{
        if (newPassword !== req.body.newPasswordConfirm) {
            throw new Error('Invalid password Confirm')
        }
        return true
    }),

    body("newPasswordConfirm")
    .notEmpty().withMessage("Please enter your new passwordConfirm"),
    validatorMiddleware,



]




exports.updateLoggedUserValidator = [
    body('name')
      .optional()
      .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
    check('email')
      .notEmpty()
      .withMessage('Email required')
      .isEmail()
      .withMessage('Invalid email address')
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('E-mail already in user'));
          }
        })
      ),
    check('phone')
      .optional()
      .isMobilePhone(['ar-EG', 'ar-SA'])
      .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  
    validatorMiddleware,
  ];