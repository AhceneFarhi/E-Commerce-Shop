const User = require('../model/User');
const asyncHandler = require('express-async-handler');


/*****************************************
 * @desc Add adress 
 * @method Post
 * @router /api/v1/adress
 * @access private(logged user)
 *//**************************************/
// $addToSet => add adress to the adressList array if doesn't exist

 exports.addAdress = asyncHandler(async(req,res,next)=>{

      const user = await User.findByIdAndUpdate(req.user._id,{
          $addToSet:{adresses:req.body}
      },{new:true})

      res.status(200).json({message:"Adress added successfully" , data:user.adresses})
 })


 /*****************************************
 * @desc Remove adress 
 * @method delete 
 * @router /api/v1/adress/:adressId
 * @access private(logged user)
 *//**************************************/
// $pull => remove the adress from the adresses array if exist

exports.removeAdress = asyncHandler(async(req,res,next)=>{

     const user = await User.findByIdAndUpdate(req.user._id,{
         $pull:{ adresses:{_id:req.params.adressId}},
     },{new:true})

     res.status(200).json({message:"Adress removed successfully" , data:user.adresses})
})


/*****************************************
 * @desc Get my adresses 
 * @method Get
 * @router /api/v1/adress
 * @access private(logged user)
 *//**************************************/

 exports.getMyAdresses = asyncHandler(async(req,res,next)=>{
     const user =await  User.findById(req.user._id)
     
     res.status(200).json({message:"Success" , results:user.adresses.length,data:user.adresses})
 })