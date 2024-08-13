const { default: mongoose } = require("mongoose");



const cartSchema = new mongoose.Schema({

    cartItems:[
        {
          product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product"
          },
          price:Number,
          color:String,
          quantiy:{
            type:Number,
            default:1,
          }
        }
    ],

    totalPrice:Number,
    totalPriceAfterDiscount:Number,

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
    {timestamps:true})



    

module.exports = mongoose.model("Cart",cartSchema)