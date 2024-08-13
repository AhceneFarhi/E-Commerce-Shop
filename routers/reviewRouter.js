const express = require('express')
const {getReview,getReviews,updateReview,deleteReview,createReview,createFilterObj,setProductIdAndUserIdToBody}= require('../controller/reviewController.js')
const Auth = require('../controller/authController.js')
const {
    createReviewValidator,
    updateReviewValidator,
    getReviewValidator,
    deleteReviewValidator
}= require('../utils/validators/reviewValidator.js')

// Nested Route
const router = express.Router({mergeParams:true})

router.use(Auth.Protect)

router.get('/',createFilterObj,getReviews) 
router.post('/',Auth.allowedTo("user"),setProductIdAndUserIdToBody,createReviewValidator,createReview)


// .../:id
router.get('/:id',getReviewValidator,getReview)
router.put('/:id',Auth.allowedTo("user"),updateReviewValidator,updateReview)  // also check if user is the owner of this review (validation)
router.delete('/:id',Auth.allowedTo("user","manager","admin"),deleteReviewValidator,deleteReview)



module.exports = router