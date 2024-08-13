const { default: mongoose } = require("mongoose");


const couponSchema = new mongoose.Schema({
      name:{
        type:String,
        trim:true,
        required:[true,"Coupon name must be provided"],
        unique:true,
      },

      expire:{
        type:Date,
        required:[true,"Coupon expiration must be provided"]
      },


      discount:{
        type:Number,
        required:[true,"Coupon discount must be provided"]
      }


}, 
    {
        timestamps:true,
    })




module.exports = mongoose.model("Coupon",couponSchema)