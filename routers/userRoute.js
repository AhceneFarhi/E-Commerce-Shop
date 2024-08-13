const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  updateLoggedUserValidator,
  changeMyPasswordValidator
} = require('../utils/validators/userValidator');

const Auth = require('../controller/authController');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  UploadUserImage,
  ResizeImageProfile,
  changePassword,
  getLoggedUserData,
  updateLoggedUserData,
  changePasswordLoggedUser,
  deleteLoggedUser,
  activateLoggedUserAccount
} = require('../controller/userController');

const reviewRoute =require('./reviewRouter')
const router = express.Router();


router.use(Auth.Protect ,Auth.verifyIfUserActive )      // User must be : logged in & active      { To avoid repetition}

// *** Nested Route ***
// Get /users/joifn124qfkh755vioulqf/reviews
// Get /users/joifn124qfkh755vioulqf/:reviewId
router.use('/:userId/reviews',reviewRoute);

// * Logged user routes
router.get('/getMe',getLoggedUserData,getUser)
router.put('/updateMe', updateLoggedUserValidator,updateLoggedUserData)
router.put('/changeMyPassword',changeMyPasswordValidator,changePasswordLoggedUser)  // changeMyPasswordValidator 
router.put('/deleteMyAccount',deleteLoggedUser)
router.put('/activateMyAccount',activateLoggedUserAccount)

// * Admin routes
router.route('/')
                .get(getUsers)
                .post(Auth.allowedTo('admin'),UploadUserImage,ResizeImageProfile,createUserValidator, createUser);

router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(Auth.allowedTo('admin'),UploadUserImage,ResizeImageProfile,updateUserValidator, updateUser)
  .delete(Auth.allowedTo('admin'),deleteUserValidator, deleteUser);


  router.route('/changePassword/:id').put(changePasswordValidator,changePassword)




















module.exports = router;