const { default: mongoose } = require("mongoose");
const Product = require("./Product");

const reviewSchema = new mongoose.Schema({
    title:String,

    rating:{
        type:Number,
        required:true,
        min:[1,"min ratings is 1.0"],
        max:[5,"max ratings is 5.0"]
    },

    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User",
    },

    product:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"Product",
    }

},{timestamps:true})


reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:"user",
        select:"name "
    })
    next()
})


reviewSchema.statics.calcAverageRatingsAndQuantity =async function(productId){
   const result = await this.aggregate([
    // Stage 01 : get all reviews belong to specified product (productId)
        { $match:{ product:productId } },

    // Stage 02 : grouping reviews based on product fields (reviews that have same produntId will be grouped)
    {
        $group: {
           _id: "$product",
           avgRatings: { $avg: "$rating" },  
           ratingsQuantity:{$sum:1}     
        
        }
      }
   ])

//    console.log(result);
   if (result.length>0) {
      await Product.findByIdAndUpdate(productId,{
        ratingsAverage:result[0].avgRatings,
        ratingsQuantity:result[0].ratingsQuantity
      })
   } else {

    await Product.findByIdAndUpdate(productId,{
        ratingsAverage:0, 
        ratingsQuantity:0
      })
   }
   
}

// Middleware to update product ratings after saving a review
reviewSchema.post('save', async function() {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
  });



  reviewSchema.post('remove', async function() {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
  });






module.exports =mongoose.model('Review',reviewSchema)