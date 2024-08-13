const express = require('express')
const {
    createCashOrder , 
    createOrderObjectForLoggedUser, 
    getAllOrders , getOrderById ,
    updateOrderToPaid , 
    updateOrderToDelivered,
    checkoutSession
        }=require('../controller/orderController')

const router=express.Router()
const Auth = require('../controller/authController')


router.use(Auth.Protect )

router.get('/checkout-session/:cartId',Auth.allowedTo('user') , checkoutSession)

router.get('/', createOrderObjectForLoggedUser , getAllOrders)

router.post('/:cartId', Auth.allowedTo("user"),createCashOrder)

router.get('/:id',getOrderById)
router.put('/:orderId/pay',Auth.allowedTo("admin","manager"),updateOrderToPaid)
router.put('/:orderId/deliver',Auth.allowedTo("admin","manager"),updateOrderToDelivered)





module.exports = router
