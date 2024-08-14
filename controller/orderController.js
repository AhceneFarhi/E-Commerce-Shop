const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const asyncHandler = require('express-async-handler');
const Cart = require('../model/Cart');
const ApiError = require('../utils/apiError');
const Order = require('../model/Order');
const Product = require('../model/Product');
const factory = require('./handlersFactory');



/*****************************************
 * @desc Create  cash order  
 * @method Post
 * @router /api/v1/orders/:cartId
 * @access private/logged User
 *//**************************************/

 exports.createCashOrder = asyncHandler(async(req,res,next) => {

    // app settings from admin
       const taxPrice=0
       const shippingPrice=0

    // 1) Get the cart depend on cartId or user ID
         const cart = await Cart.findById(req.params.cartId)
         if (!cart) {
            return next( new ApiError(`Cart not found`,404) );
         }
    // 2) Get order price depending on cartTotalPrice (check if coupon apply)
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice    // or " cart.totalPriceAfterDiscount || cart.totalPrice "
    const totalOrderPrice = cartPrice +taxPrice+shippingPrice

    // 3) Create the order with default paymentMethodType cash
           const order = await Order.create({
               user:req.user._id,
               cartItems:cart.cartItems,
               shippingAdress:req.body.shippingAdress,
               totalOrderPrice:totalOrderPrice
           })
    // 4) After creating the order , decrement product quantity and increment product sold 
      if (order) {
        const bulkOption = cart.cartItems.map((item)=>({
            updateOne:{
             filter:{ _id:item.product },
             update:{ $inc: { quantity:-item.quantiy , sold:+item.quantiy }}
            }
        }))

        await Product.bulkWrite(bulkOption,{})

      }


    // 5) Clear cart depend on cart id
    await Cart.findByIdAndDelete(req.params.cartId)

    res.status(201).json({
        status:'Order created successefully',
        data:order
    })

 })



 exports.createOrderObjectForLoggedUser = (req,res,next)=>{
     if (req.user.role ==="user") {
      req.filterObject={user:req.user._id}
     }
     next()
 }
 
/*****************************************
 * @desc Get all orders  
 * @method Get
 * @router /api/v1/orders
 * @access private/logged User-Admin-Manager
 *//**************************************/
 exports.getAllOrders = factory.getAll(Order)

 
/*****************************************
 * @desc Get order by Id  
 * @method Get
 * @router /api/v1/orders/:id
 * @access private/logged User
 *//**************************************/
 exports.getOrderById = factory.getOne(Order)



 /*****************************************
 * @desc Update order paid to paid   
 * @method Put
 * @router /api/v1/orders/:orderId/pay
 * @access private/Admin-Manager
 *//**************************************/

 exports.updateOrderToPaid = asyncHandler(async(req,res,next)=>{
         const updateOrder = await Order.findByIdAndUpdate(req.params.orderId,
          {
            isPaid:true,
            paidAt:Date.now()
          },
          {new:true})

          res.status(200).json({status:"Success" , data:updateOrder})

        //   // Another way to update 
        //   const order = await Order.findById(req.params.orderId)
        //   order.isPaid = true;
        //   order.paidAt = Date.now()

        // const updateOrder =  await order.save()
 })



 
 /*****************************************
 * @desc Update order delivered to true   
 * @method Put
 * @router /api/v1/orders/:orderId/deliver
 * @access private/Admin-Manager
 *//**************************************/

 exports.updateOrderToDelivered = asyncHandler(async(req,res,next)=>{
  const updateOrder = await Order.findByIdAndUpdate(req.params.orderId,
   {
    isDelivered:true,
    deliveredAt:Date.now()
   },
   {new:true})

   res.status(200).json({status:"Success" , data:updateOrder})
})




 /*****************************************
 * @desc Get checkout session from Stripe and send it as a response 
 * @method GET
 * @router /api/v1/orders/checkout-session/:cartId
 * @access private/Admin-Manager
 *//**************************************/
 exports.checkoutSession = asyncHandler(async(req, res, next)=>{

    // App Settings
    const taxPrice = 0
    const shippingPrice=0
    // 1) Get the cart's user to recuperate the total cart price
     const cart = await Cart.findById(req.params.cartId)
     if (!cart) {
      return next(new ApiError(`There is no cart for this id :${req.params.cartId}`,404))
     }

     // 2) Calculate the total order price dpend cartTotalPrice 

     const cartTotalPrice = cart.totalPriceAfterDiscount || cart.totalPrice
     const totalOrderPrice = cartTotalPrice + taxPrice + shippingPrice

  
     // 3) Create stripe checkout session
     const session = await stripe.checkout.sessions.create({

      payment_method_types: ['card'],

   line_items:[{ 

         price_data:{

          currency: 'egp',
          unit_amount: totalOrderPrice *100,
          product_data: { name: req.user.name, }, 

         },

   quantity: 1, 

  },
   ],

   mode: 'payment',
   success_url: `${req.protocol}://${req.get('host')}/orders`,
   cancel_url: `${req.protocol}://${req.get('host')}/cart`, 

   customer_email: req.user.email, 
   client_reference_id: req.params.cartId,
    metadata: req.body.shippingAdress ,

   });

  // const session = await Stripe.checkout.sessions.create({


    
  //   line_items: [
  //     {
  //      name:req.user.name,
  //      amount:totalOrderPrice*100,
  //      currency:'DZD',
  //      quantity:1,
  //     },
  //   ],

  //   mode: 'payment',
  //   success_url: `${req.protocol}://${req.get('host')}/orders`,
  //   cancel_url: `${req.protocol}://${req.get('host')}/cart`,
  //   customer_email:req.user.email,
  //   metadata:req.body.shippingAdress

  // })





  //// 4) Send session to response


  res.status(200).json({status: 'success',session})

 })










 
const createCardOrder = async (session) => {
   const cartId = session.client_reference_id;
   const shippingAddress = session.metadata;
   const oderPrice = session.amount_total / 100;
 
   const cart = await Cart.findById(cartId);
   const user = await User.findOne({ email: session.customer_email });
 
   // 3) Create order with default paymentMethodType card
   const order = await Order.create({
     user: user._id,
     cartItems: cart.cartItems,
     shippingAddress,
     totalOrderPrice: oderPrice,
     isPaid: true,
     paidAt: Date.now(),
     paymentMethodType: 'card',
   });
 
   // 4) After creating order, decrement product quantity, increment product sold
   if (order) {
     const bulkOption = cart.cartItems.map((item) => ({
       updateOne: {
         filter: { _id: item.product },
         update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
       },
     }));
     await Product.bulkWrite(bulkOption, {});
 
     // 5) Clear cart depend on cartId
     await Cart.findByIdAndDelete(cartId);
   }
 };

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
   const sig = req.headers['stripe-signature'];
 
   let event;
 
   try {
     event = stripe.webhooks.constructEvent(
       req.body,
       sig,
       process.env.STRIPE_WEBHOOK_SECRET
     );
   } catch (err) {
     return res.status(400).send(`Webhook Error: ${err.message}`);
   }
   if (event.type === 'checkout.session.completed') {
     //  Create order
     createCardOrder(event.data.object);
   }
 
   res.status(200).json({ received: true });
 });