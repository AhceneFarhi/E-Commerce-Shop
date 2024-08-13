const express = require('express')
const {singUp , Login , forgotPassword , verifyResetCode , resetPassword , verifyIfUserActive} = require('../controller/authController')
const {SignUpValidator ,LoginValidator} = require('../utils/validators/authValidator')


const router = express.Router()

router.post('/signup',SignUpValidator, singUp)
router.post('/login',LoginValidator,Login)

router.use(verifyIfUserActive)

router.post('/forgotPassword',forgotPassword)
router.post('/verifyResetCode',verifyResetCode)
router.put('/resetPassword',resetPassword)




module.exports = router