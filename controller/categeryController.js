const factory = require('./handlersFactory');
const Category = require('../model/Category');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const {UploadSingleImage} = require('../middlewares/imageUploadMiddlewares')



// Upload a single image
exports.UploadCategoryImage = UploadSingleImage("image");


//------ Image Processing ------ 
exports.ResizeImage =asyncHandler(async (req, res,next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`  // Build a unique filename
  if (req.file) {
    await  sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/categories/${filename}`)

    // To save the image into database
    req.body.image = filename
  }
    next();
})


// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public

exports.getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);













































































































// const {Category, ValidateCreateCategory, ValidateUpdateCategory} = require('../model/Category')
// const slugify = require('slugify');
// const factory = require('./handlersFactory')



// /**-----------------------------------------------
//  * @desc  Create a new Category
//  * @method Post
//  * @router /api/categories/
//  * @access private (only Admin)
//  -----------------------------------------------*/
// //  const ApplySlugifyCreate = (req, res, next) => {
// //   req.body.slug =slugify(req.body.name)
// //   next()
// // }

// const ApplySlugifyCreate = (req, res, next) => {
//   if (typeof req.body.name !== 'string') {
//     return res.status(400).json({ error: 'name must be a string' });
//   }

//   req.body.slug = slugify(req.body.name);
//   next();
// };
//  const CreateCategory = factory.CreateOne(Category,ValidateCreateCategory)


// /**-----------------------------------------------
//  * @desc  Get all categories
//  * @method Get
//  * @router /api/categories/
//  * @access public 
//  -----------------------------------------------*/

// const GetAllCategories = factory.GetAll(Category)


// /**-----------------------------------------------
//  * @desc  Get category by Id
//  * @method Get
//  * @router /api/categories/:id
//  * @access public 
//  -----------------------------------------------*/

// const GetCategoriesById= factory.GetONeById(Category)
// const ApplySlugify = (req, res, next) => {
//     req.body.slug =slugify(req.body.name)
//     next()
//   }
// /**-----------------------------------------------
//  * @desc  Update category by Id
//  * @method Put
//  * @router /api/categories/:id
//  * @access private (only Admin) 
//  -----------------------------------------------*/

//  const UpdateCategoriesById = factory.UpdateOne(Category,ValidateUpdateCategory)


// /**-----------------------------------------------
//  * @desc  Delete category by Id
//  * @method Delet
//  * @router /api/categories/:id
//  * @access private (only Admin) 
//  -----------------------------------------------*/
// const DeleteCategory = factory.deleteOne(Category)


// // ApplySlugifyCreate
//  module.exports = {CreateCategory , GetAllCategories , GetCategoriesById , UpdateCategoriesById, ApplySlugifyCreate, DeleteCategory,ApplySlugify}