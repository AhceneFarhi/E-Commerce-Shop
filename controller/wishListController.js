const User = require('../model/User');
const asyncHandler = require('express-async-handler');


/*****************************************
 * @desc Add to wishlist 
 * @method Post
 * @router /api/v1/wishlist
 * @access private(logged user)
 *//**************************************/
// $addToSet => add the product to the wishlist array if doesn't exist

 exports.addProductToWishlist = asyncHandler(async(req,res,next)=>{

      const user = await User.findByIdAndUpdate(req.user._id,{
          $addToSet:{wishList:req.body.productId}
      },{new:true})

      res.status(200).json({message:"Product added successfully" , data:user.wishList})
 })


 /*****************************************
 * @desc Remove from wishlist 
 * @method delete
 * @router /api/v1/wishlist/:productId
 * @access private(logged user)
 *//**************************************/
// $pull => remove the product from the wishlist array if exist

exports.removeProductFromWishlist = asyncHandler(async(req,res,next)=>{

     const user = await User.findByIdAndUpdate(req.user._id,{
         $pull:{wishList:req.params.productId}
     },{new:true})

     res.status(200).json({message:"Product removed successfully" , data:user.wishList})
})


/*****************************************
 * @desc Get my wishlist 
 * @method Get
 * @router /api/v1/wishlist
 * @access private(logged user)
 *//**************************************/

 exports.getMyWishlist = asyncHandler(async(req,res,next)=>{
     const user =await  User.findById(req.user._id).populate({path:"wishList" , select:"title price ratingsAverage ratingsQuantity"})
     
     res.status(200).json({message:"Success" , results:user.wishList.length,data:user.wishList})
 })