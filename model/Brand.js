const mongoose = require('mongoose');
// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand required'],
      unique: [true, 'Brand must be unique'],
      minlength: [3, 'Too short Brand name'],
      maxlength: [32, 'Too long Brand name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
brandSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
brandSchema.post('save', (doc) => {
  setImageURL(doc);
});

// 2- Create model
module.exports = mongoose.model('Brand', brandSchema);


















































// const mongoose = require('mongoose')
// const joi = require('joi')
// const { default: slugify } = require('slugify')
// const { name } = require('eslint-plugin-prettier')

// const BrandSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//         minlength:3,
//         maxlength:20,
//         unique:true,
//     },
//     image:String,
//    // A and B => shopping.com/a-and-b
//     slug:{
//         type:String,
//         lowercase:true,   
//     }
    
// },{timestamps:true})


// // Create model

// const Brand = mongoose.model('Brand',BrandSchema)

// function ValidateCreateBrand(obj) {
//     const shcema= joi.object({
//           name:joi.string().trim().min(3).max(20).required(),
//           slug:joi.string(),  
//     })
//     return shcema.validate(obj)
// }

// function ValidateUpdateBrand(obj) {
//     const shcema= joi.object({
//           name:joi.string().trim().min(3).max(20),
//           slug:joi.string()
//     })
//     return shcema.validate(obj)
// }




// module.exports = {Brand , ValidateCreateBrand , ValidateUpdateBrand}