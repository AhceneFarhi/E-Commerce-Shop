const express = require('express')
const {addProductToWishlist , removeProductFromWishlist , getMyWishlist}=require('../controller/wishListController')

const router=express.Router()
const Auth = require('../controller/authController')



router.post('/',Auth.Protect, addProductToWishlist)  // addProductToWishlistValidator function : (A faire )
router.get('/',Auth.Protect, getMyWishlist)
router.delete('/:productId',Auth.Protect, removeProductFromWishlist)










module.exports = router
