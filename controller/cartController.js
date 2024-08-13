const asyncHandler = require('express-async-handler');
const Product = require('../model/Product');
const Cart = require('../model/Cart');
const ApiError = require('../utils/apiError');
const Coupon = require('../model/Coupon');

// Calculate the total price of the cart && save it into database
const calculateTotalPrice = (cart)=>{
    let totalPrice = 0;
    cart.cartItems.forEach((item)=>{
       totalPrice += item.price*item.quantiy
    })

    cart.totalPrice = totalPrice
    cart.totalPriceAfterDiscount=undefined
    return totalPrice;
}

/*****************************************
 * @desc Add product to cart 
 * @method Post
 * @router /api/v1/cart
 * @access private/logged User
 *//**************************************/

 exports.addProductToCart = asyncHandler(async(req,res,next) => {
    const {productId , color} = req.body
    const product = await Product.findById(req.body.productId);

    let cart = await Cart.findOne({user:req.user._id})
    
    //A)- Check if user has already a cart 
    if (!cart) {
        // Create cart for the user
        cart = await Cart.create(
            {
                user: req.user._id,
                cartItems:[
                    {
                      product:productId,
                      price:product.price,
                      color:color,
                    }
                ]
            }
        )
        
    } else {
        // 1-Check if the added product is already in the cart        
        const productIndex = cart.cartItems.findIndex( (item)=>  item.product.toString() === productId && item.color === color)
         
       // ** If product exist ==> update the field quantity 
        if (productIndex>-1) {

            const productItem = cart.cartItems[productIndex]
            productItem.quantiy +=1
            cart.cartItems[productIndex] = productItem
            

        } else {  // ** if prduct does not exist ==> push the product into the cartItems

            cart.cartItems.push( {
                product:productId,
                price:product.price,
                color:color,
              })

        }
    }


    // B)-Calculate the total cart price
   calculateTotalPrice(cart)
    await cart.save()

    res.status(200).json({message:"Product added successfully" , data:cart})
 })




 /*****************************************
 * @desc Get logged user cart
 * @method get
 * @router /api/v1/cart
 * @access private/logged User
 *//**************************************/

 exports.getMyCart = asyncHandler(async(req,res,next)=>{
    const cart = await Cart.findOne({user:req.user._id})

    if (!cart) {
        return res.status(404).json({message:`No cart found for this user Id : ${req.user._id}`})
    }

    res.status(200).json({
        status:"Success",
        numberOfCartItems:cart.cartItems.length,
        data:cart
    })
 })

 
 /*****************************************
 * @desc remove item from the cart
 * @method delete
 * @router /api/v1/cart/:itemId
 * @access private/logged User
 *//**************************************/
 exports.deleteProductFromCart=asyncHandler(async(req,res,next)=>{
    const updatedCart = await Cart.findOneAndUpdate({user:req.user._id},
        {
            $pull:{ cartItems: {_id:req.params.itemId}}
        }
        ,{new:true})

        if (!updatedCart) {
            return res.status(404).json({message:"You have not a cart yet , you must create a cart first"})
        }
       calculateTotalPrice(updatedCart)
      await updatedCart.save()

    res.status(200).json({status:"Success" , message:"Product deleted successuflly" , data:updatedCart})
 })


 /*****************************************
 * @desc update itemCart quantity
 * @method Put
 * @router /api/v1/cart/:itemId
 * @access private/logged User
 *//**************************************/

 exports.updateItemCartQuantity = asyncHandler(async(req,res,next)=>{
    const cart = await Cart.findOne({user:req.user._id})

    const itemIndex = cart.cartItems.findIndex( item=> item._id.toString() === req.params.itemId)

    if (itemIndex>-1) {
        const item = cart.cartItems[itemIndex]
        item.quantiy = req.body.quantity
        cart.cartItems[itemIndex] = item
    } else {
        return next(new ApiError(`No item found with id ${req.params.itemId}`,404))
    }

   calculateTotalPrice(cart)
  
     await cart.save()

    res.status(200).json({
        status:"Success",
        message:"Item quantity updated successefully ",
        numberOfCartItems:cart.cartItems.length,
        data:cart
    })
 })


 
 /*****************************************
 * @desc Apply coupon
 * @method Put
 * @router /api/v1/cart/applyCoupon
 * @access private/logged User
 *//**************************************/

 exports.applyCouponForTotalPrice = asyncHandler(async(req,res,next)=>{
    //1-Get the coupon 
    const coupon = await Coupon.findOne({ name:req.body.couponName , expire:{ $gt:Date.now()}  })

    if (!coupon) {
        return next(new ApiError("Coupon name invalid or expired"))
    }

    //2-Get the cart to recuperate the totalPrice
    const cart = await Cart.findOne({user:req.user._id})

    const totalPrice = cart.totalPrice

    const totalPriceAfterDiscount = (totalPrice -(totalPrice*coupon.discount)/100).toFixed(2)

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount

    await cart.save()

    res.status(200).json({
        status:"Success",
        message:"Coupon has been aplied successefully ",
        numberOfCartItems:cart.cartItems.length,
        data:cart
    })

 })


