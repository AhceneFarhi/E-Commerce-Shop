const asyncHandler = require('express-async-handler');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const ApiError = require('../utils/apiError');
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail');
const { text } = require('express');

const GenerateToken = (payload) => {
    return (
        jwt.sign({userId:payload},process.env.TOKEN_SECRET_KEY , {expiresIn:process.env.JWT_EXPIRE_TIME})
    )
}


/*****************************************
 * @desc Sign up 
 * @method Post
 * @router /api/v1/auth/signup
 * @access public
 *//**************************************/
exports.singUp = asyncHandler(async(req,res,next)=>{
     // 1- Create user
     const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
     })

     // 2- Generate Token 
     const token = GenerateToken(user._id)

     res.status(201).json({date:user , token})
}) 



/*****************************************
 * @desc login 
 * @method Post
 * @router /api/v1/auth/login
 * @access public
 *//**************************************/
exports.Login = asyncHandler(async(req,res)=>{
     // 1- validate email & password (validation)

     // 2- check email and password from dataBase
     const user = await User.findOne({email:req.body.email})
      const isSame = await bcrypt.compare(req.body.password, user.password)

     if (!user || !isSame) {
        return res.status(401).json({message:"Invalid password or email address "})
      } 

     // 3- Generate Token
     const token = GenerateToken(user._id)
     // 4- Send response 
     res.status(200).json({data : user ,token})

})


/*****************************************
 * 
 * @desc make sure that user is logged in
 *  
 *//**************************************/

 exports.Protect = asyncHandler(async(req, res, next)=>{
    // 1- Check if token exist , if yes get it 
     const token = req.headers.authorization.split(" ")[1]

     if (!token) {
       return next(new ApiError("You are not login " , 401))
     }

     // 2- Verify token if (no change hapens && expired token) 
    
   const decoded=  jwt.verify(token,process.env.TOKEN_SECRET_KEY)

   // 3- Check if user exists in database 
   const currentUser = await User.findById(decoded.userId)
    
   if (!currentUser) {
    return res.status(401).json({message:"The user belongs to this token does not exist in the database"})
   }

   // 4- Check if user changed password after token created 
   if (currentUser.passwordChangedAt) {
       const  passwordChangedAttimestamps = parseInt(currentUser.passwordChangedAt.getTime() /1000 , 10)   // to change la date (passwordChangedAt) to an integer on second 

       if (passwordChangedAttimestamps > decoded.iat) {
        return next(new ApiError('User recently changed password , please login again ...',401))   // 401 : unauthorized
       }
       console.log(decoded.iat,' | ',passwordChangedAttimestamps);

   }

   req.user = currentUser
   next()
})



/*****************************************
 * 
 * @desc Verify authorization
 *  
 *//**************************************/
// ['admin','manager']
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) =>{
     // 1- access to the roles 
     // 2- access the registered user (req.user.role)
     if (!roles.includes(req.user.role)) {
      return next(new ApiError('You are not allowed ..',403))
     }

     next()
})

/*****************************************
 * 
 * @desc Verify if user active  authorization
 *  
 *//**************************************/
exports.verifyIfUserActive = asyncHandler(async (req, res, next) =>{
    const currentUser = await User.findById(req.user._id)

    if (!currentUser.active) {
        return res.status(403).json({message:`${currentUser.name} , your account is not active `})
    }

    next()
})



//----------------------------------------------------------------- FORGOT PASSWORD CYCLE ---------------------------------------------------------------------------------------------

/*****************************************
 * @desc forgot password 
 * @method Post
 * @router /api/v1/auth/forgotPassword
 * @access public
 *//**************************************/
 exports.forgotPassword = asyncHandler(async(req, res, next)=>{
    // 1) Get user by email
    const user = await User.findOne({email: req.body.email})
    if (!user) {
         return next(new ApiError(`No user found for this email address ${req.body.email}`, 404));
    }
    // 2) Generate hashed reset code random with 6 digits and save it in Db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()

    const hashedResetCode = crypto
                                 .createHash('sha256')
                                 .update(resetCode)
                                 .digest('hex')
      
          // save the hashed reset code into db
          user.passwordResetCode = hashedResetCode
          // add expiration time for the reset code (10 min)
          user.passwordResetExpirs = Date.now() + 10*60*1000

          user.passwordResetVerified = false ;

          const savedUser = await user.save();
          if (!savedUser) {
              return next(new ApiError('Error saving user data', 500));
          }    
          
          // 3)- Send reset code via email

          try {
              await sendEmail({email:user.email , subject:'Reset Code ' , message:`Hi lhooo \n Take your reset code : \n ${resetCode} ,\n Hmimsa mli7a `})

          } catch (error) {
              user.passwordResetCode = undefined
              user.passwordResetExpirs = undefined
              user.passwordResetVerified = undefined ;
              await user.save()
              return next(new ApiError("There is an error in sending email. Please try again" , 500))
          }

          res.status(200).json({status:'success',message:'reset code sent to email'})


})


/*****************************************
* @desc Verify password reset code 
* @method Post
* @router /api/v1/auth/verifyResetCode
* @access public
*//**************************************/
exports.verifyResetCode = asyncHandler(async(req, res, next)=>{
     // 1)- get user based on password reset code 
     const hashedResetCode = crypto
     .createHash('sha256')
     .update(req.body.resetCode)
     .digest('hex')

     const user = await User.findOne({
         passwordResetCode: hashedResetCode,
         passwordResetExpirs:{$gt:Date.now()}
     })

     if (!user) {
         return next(new ApiError('Invalid reset code or expired password code '))
     }

    // 2) reset code verification is true
    user.passwordResetVerified=true
    await user.save()

    res.status(200).json({message:'Success'})
})



/*****************************************
* @desc Reset Password 
* @method Put
* @router /api/v1/auth/resetPassword
* @access public
*//**************************************/

exports.resetPassword = asyncHandler(async(req, res, next)=>{
      // 1)- Get user based on email
      const user = await User.findOne({ email: req.body.email})

      if (!user) {
         return next(new ApiError(`There is no user with email ${req.body.email}`,404))
      }
    // 2)- Check if reset Code verified
    if (!user.passwordResetVerified) {
         return res.status(400).json({message:"Error!! Reset Code not verified"})
    }
    user.password=req.body.newPassword
    user.passwordResetVerified=undefined 
    user.passwordChangedAt=undefined
    user.passwordResetCode=undefined
    user.passwordResetExpirs=undefined
    
    await user.save()

    // 3)- Generate new token (logout)
    const token = GenerateToken(user._id)
    res.status(200).json({token})
})




























































































