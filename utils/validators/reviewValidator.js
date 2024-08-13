const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../model/Review");
const Product = require("../../model/Product");


exports.createReviewValidator = [
    check("title").optional(),

    check("rating")
    .notEmpty().withMessage("Rating is required")
    .isFloat({min:1,max:5}).withMessage("Rating must be between 1 and 5")   ,

    check("user")
    .notEmpty().withMessage("User must be specified ")
    .isMongoId().withMessage("User must be a valid Mongo ID"),

    check("product")
    .notEmpty().withMessage("Product is required")
    .isMongoId().withMessage("Product must be a valid Mongo ID")
    .custom(async(val,{req})=>{  

        const product = await Product.findById(val)
        if (product) {

            if (req.user._id.toString() === req.body.user) {
                const review = await Review.findOne({user:req.user._id, product:val})
                if (review) {
                    throw new Error('You already have a review')
                }
            } else {
                     throw new Error('The id of user which you write doesnt belong to your id !!! ')
            }
    
        } else {
                 throw new Error(`No product found for this id : ${val}`)
        }
      
        return true;
    })
    // .custom((val,{req})=>
    // {
    //     console.log(req.user._id.toString() === req.body.user);
    //     console.log(req.user._id.toString());
    //     console.log(req.body.user);
        
        
    //     if (req.user._id.toString() === req.body.user) {
    //         Review.findOne({user:req.user._id, product:val}).then((review)=>{
    //             if (review) {
    //                return Promise.reject(new Error('You already have a review '))
    //             } }) 
    //     }else{
    //           return Promise.reject(new Error('The id of user which you write doesnt belong to logged user !!! '))
    //     }
    //     return true;
          
    // }
    //    )
  ,
   validatorMiddleware
]

exports.getReviewValidator = [
   check("id").isMongoId().withMessage("Invalid id format"),
   validatorMiddleware
]


exports.updateReviewValidator =[
    check("id").isMongoId().withMessage("Invalid Id format")
    .custom(async(reviewId,{req})=>{
       const review = await Review.findOne({id:reviewId})

       if (!review) {
        throw new Error("Review not found");
       }
// console.log(review.user === req.user._id);   // the result is false because we cannot compare two objects
// console.log(review.user.toString() === req.user._id.toString());   // the result is true

       if (review.user._id.toString() !== req.user._id.toString()) {  // Because we make populate and user become an objcet and not an objectId
        throw new Error("This review is not yours");
       }
       return true;
    })
    ,
    check("title").optional(),

    check("rating")
    .optional()
    .isFloat({min:1,max:5}).withMessage("Rating must be between 1 and 5")   ,

    validatorMiddleware
]


exports.deleteReviewValidator =[
    check("id").isMongoId().withMessage("Invalid Id format")
    .custom(async(reviewId,{req})=>{
       const review = await Review.findOne({id:reviewId})

       if (!review) {
        throw new Error("Review not found");
       }

if (req.user.role ==="admin" || req.user.role==="manager") {
    return true
} else {

    if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("This review is not yours");
       }
}

       return true;
    })
    ,

    validatorMiddleware
]








































































