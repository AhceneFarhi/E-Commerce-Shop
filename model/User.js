const { required } = require("joi");
const { default: mongoose, model, Mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
    name:{ 
        type:String,
        trim:true,
        required:[true,'name is required'],
    },

    slug:{
        type:String,
        lowercase:true,
    },

    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        lowercase:true,
    },

    phone:String,

    profileImage :String,

    password:{
        type:String,
        required:[true,'password is required'],
        minlength:[6, 'password must be at least 6 characters']
    },
    passwordChangedAt:Date,
    passwordResetCode:String,
    passwordResetExpirs:Date,
    passwordResetVerified:Boolean,
    role:{
        type:String,
        enum:['admin', 'user','manager'],
        default:'user',
    },

    active:{
        type:Boolean,
        default:true,
    },

    wishList:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Product',
        }
            ],

    adresses:[
        {
            id:{ type:mongoose.Schema.Types.ObjectId },
            alias:String,
            datails:String,
            phone:String,
            city:String,
            postalCode:String,
        }
    ]

} ,{timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals are included in JSON output
    toObject: { virtuals: true } // Ensure virtuals are included in object output

})



userSchema.pre('save',async function (next){  // in createUser function  bcrypt password before saving user 

    if(!this.isModified("password")) return next()   
  this.password = await bcrypt.hash(this.password,12)
next()

})


userSchema.virtual("myReviews",{
    ref:"Review",
    foreignField:"user",
    localField:"_id"
})
  



const User =  mongoose.model('User',userSchema)

module.exports =User