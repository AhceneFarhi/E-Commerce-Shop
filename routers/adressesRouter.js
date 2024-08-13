const express = require('express')
const {addAdress , removeAdress , getMyAdresses}=require('../controller/adressesController')

const router=express.Router()
const Auth = require('../controller/authController')



router.post('/',Auth.Protect, addAdress)  // addAdressValidator function : (A faire )
router.get('/',Auth.Protect, getMyAdresses)   
router.delete('/:adressId',Auth.Protect, removeAdress)   // removeAdressValidator (A faire)










module.exports = router
