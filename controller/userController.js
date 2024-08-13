const factory = require('./handlersFactory');
const User = require('../model/User');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const {UploadSingleImage} = require('../middlewares/imageUploadMiddlewares')
const asyncHandler = require('express-async-handler');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const GenerateToken = (payload) => {
  return (
      jwt.sign({userId:payload},process.env.TOKEN_SECRET_KEY , {expiresIn:process.env.JWT_EXPIRE_TIME})
  )
}


// Upload a single image
exports.UploadUserImage = UploadSingleImage("profileImage");


//------ Image Processing ------ 
exports.ResizeImageProfile =asyncHandler(async (req, res,next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`  // Build a unique filename
    
    if (req.file) {

      await  sharp(req.file.buffer)
      .resize(600,600)
      .toFormat('jpeg')
      .jpeg({quality:90})
      .toFile(`uploads/users/${filename}`)
  
      // To save the image into database
      req.body.profileImage = filename

    }
  
    next();
})


/*****************************************
 * @desc Get list of users 
 * @method Get
 * @router /api/v1/users
 * @access private
 *//**************************************/
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  private
exports.getUser = factory.getOne(User,"myReviews");

// @desc    Create user
// @route   POST  /api/v1/users
// @access  private
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private

exports.updateUser =  asyncHandler(async (req, res) => {
  const document = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    profileImage: req.body.profileImage,
    role: req.body.role,
    password:await bcrypt.hash(req.body.password,12),

  }, {
    new: true,
  });

  if (!document) {
    return next(
      new ApiError(`No document for this id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: document });
});

/*****************************************
 * @desc change password 
 * @method Put
 * @router /api/v1/users/changPassword/:id
 * @access private  (only admin)
 *//**************************************/

 exports.changePassword = asyncHandler(async(req,res)=>{
  const user = await User.findByIdAndUpdate(req.params.id,{
    password:await bcrypt.hash(req.body.password,12),
    passwordChangedAt:Date.now(),
  },{new:true})

  res.status(200).json({ data: user });
})


// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);






/*****************************************
 * @desc get logged user data 
 * @method Get
 * @router /api/v1/users/getMe
 * @access private  (only logged in users)
 *//**************************************/
 exports.getLoggedUserData = asyncHandler(async(req, res, next)=>{
  req.params.id = req.user._id
  next()
 })

 /*****************************************
 * @desc update logged user data 
 * @method Put
 * @router /api/v1/users/updateMe
 * @access private  (only logged in users)
 *//**************************************/
 exports.updateLoggedUserData =  asyncHandler(async(req,res,next)=>{
  const updatedUser = await User.findByIdAndUpdate(req.user._id,{
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone
  },{new:true})

  res.status(200).json({Result:updatedUser})
})


 /*****************************************
 * @desc change password 
 * @method Put
 * @router /api/v1/users/changeMyPassword
 * @access private  (only logged in users)
 *//**************************************/

exports.changePasswordLoggedUser = asyncHandler(async(req,res)=>{
  // 1)- Get user based on payload (req.user._id)
  const updatedUser = await User.findByIdAndUpdate(req.user._id,{
    password:await bcrypt.hash(req.body.newPassword,12),
    passwordChangedAt:Date.now(),
  },{new:true})
   
  // 2)-Generate a new token 
  const token = GenerateToken(updatedUser.id)
  res.status(200).json({ data: updatedUser , token });
})



/*****************************************
 * @desc deactivate my account 
 * @method Put
 * @router /api/v1/users/deleteMyAccount
 * @access private  (only logged in users)
 *//**************************************/

 exports.deleteLoggedUser = asyncHandler(async(req, res, next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false},{new:true})
  res.status(204).json({status:'success'})
})

/*****************************************
 * @desc Activate my account 
 * @method Put
 * @router /api/v1/users/activateMyAccount
 * @access private  (only logged in users)
 *//**************************************/
 
 exports.activateLoggedUserAccount = asyncHandler(async(req, res, next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:true},{new:true})
  res.status(204).json({status:'success'})
})






















































































































































