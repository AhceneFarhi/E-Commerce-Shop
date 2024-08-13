const express = require('express');

const {
   addProductToCart,
   getMyCart,
   deleteProductFromCart,
   updateItemCartQuantity,
   applyCouponForTotalPrice
} = require('../controller/cartController');

const Auth = require('../controller/authController');

const router = express.Router();

router.use(Auth.Protect,Auth.allowedTo("user"));

router.post("/",addProductToCart)
router.get("/",getMyCart)
router.put("/applyCoupon",applyCouponForTotalPrice)


router.delete("/:itemId",deleteProductFromCart)
router.put("/:itemId",updateItemCartQuantity)






module.exports = router;