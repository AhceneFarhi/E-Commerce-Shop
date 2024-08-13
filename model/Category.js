const mongoose = require('mongoose');
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category required'],
      unique: [true, 'Category must be unique'],
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name'],
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

//--------------------------------------------------------------------------------------------------------------------
                                          //  Image Url
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
categorySchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
categorySchema.post('save', (doc) => {
  setImageURL(doc);
});

//--------------------------------------------------------------------------------------------------------------------


module.exports = mongoose.model('Category', categorySchema);;
















































































// const mongoose = require('mongoose')
// const joi = require('joi')

// const categorySchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//         minlength:3,
//         maxlength:20,
//         unique:true,
//     },
   
//    // A and B => shopping.com/a-and-b
//     slug:{
//         type:String,
//         lowercase:true,   
//     },
//     image:String,
    
// },{timestamps:true})


// // Create model

// const Category = mongoose.model('Category',categorySchema)

// function ValidateCreateCategory(obj) {
  
//     const shcema= joi.object({
//           name:joi.string().trim().min(3).max(20).required(),
//           slug:joi.string(),  
//     })
//     return shcema.validate(obj)
// }

// function ValidateUpdateCategory(obj) {
//     const shcema= joi.object({
//           name:joi.string().trim().min(3).max(20), 
//           slug:joi.string() 
//     })
//     return shcema.validate(obj)
// }


// module.exports = {Category , ValidateCreateCategory , ValidateUpdateCategory}