const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const Review = require('../model/Review');

//----------- Nested Route -----------
// Get /products/:productId/reviews
// Get /users/:userId/reviews
exports.createFilterObj=asyncHandler(async(req,res,next)=>{
    if (req.params.productId)  req.filterObject = {product:req.params.productId}
    if(req.params.userId) req.filterObject = {user:req.params.userId}
    
    next()
})



// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/Protected/User

// Nested Route
exports.setProductIdAndUserIdToBody =(req, res, next)=>{
    if(!req.body.product)  req.body.product =req.params.productId
    if (!req.body.user) req.body.user =req.user._id.toString()
    next() 
}
exports.createReview = factory.createOne(Review);

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User or Admin
exports.deleteReview = factory.deleteOne(Review);










































