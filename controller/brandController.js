const factory = require('./handlersFactory');
const Brand = require('../model/Brand');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const {UploadSingleImage} = require('../middlewares/imageUploadMiddlewares')
const asyncHandler = require('express-async-handler');




// Upload a single image
exports.UploadBrandImage = UploadSingleImage("image");


//------ Image Processing ------ 
exports.ResizeImage =asyncHandler(async (req, res,next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`  // Build a unique filename
  await  sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/brands/${filename}`)

    // To save the image into database
    req.body.image = filename
    next();
})

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(Brand);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand);

// @desc    Create brand
// @route   POST  /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(Brand);

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);














































// const {Brand, ValidateCreateBrand, ValidateUpdateBrand} = require('../model/Brand')
// const slugify = require('slugify');
// const factory = require('./handlersFactory')


// /**--------------------------------------------------------------
//  * @desc  Create a new Brand
//  * @method Post
//  * @router /api/brands/
//  * @access private (only Admin)
//  -----------------------------------------------------------------*/
//  const ApplySlugifyCreate = (req, res, next) => {
//   req.body.slug =slugify(req.body.name)
//   next()
// }
//  const CreateBrand = factory.CreateOne(Brand,ValidateCreateBrand)


// /**-----------------------------------------------
//  * @desc  Get all brands
//  * @method Get
//  * @router /api/brands/
//  * @access public 
//  -----------------------------------------------*/

// const GetAllBrands = factory.GetAll(Brand)


// /**-----------------------------------------------
//  * @desc  Get brand by Id
//  * @method Get
//  * @router /api/brands/:id
//  * @access public 
//  -----------------------------------------------*/

// const GetBrandsById=factory.GetONeById(Brand)




// /**-----------------------------------------------
//  * @desc  Update brand by Id
//  * @method Put
//  * @router /api/brands/:id
//  * @access private (only Admin) 
//  -----------------------------------------------*/
//  const ApplySlugify = (req, res, next) => {
//   req.body.slug =slugify(req.body.name)
//   next()
// }
//  const UpdateBrandsById = factory.UpdateOne(Brand,ValidateUpdateBrand)

// /**-----------------------------------------------
//  * @desc  Delete brand by Id
//  * @method Delet
//  * @router /api/brands/:id
//  * @access private (only Admin) 
//  -----------------------------------------------*/
// const DeleteBrand = factory.deleteOne(Brand)



//  module.exports = {CreateBrand , GetAllBrands , GetBrandsById , UpdateBrandsById , DeleteBrand , ApplySlugify,ApplySlugifyCreate}