const express = require('express');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validators/productValidator');

const Auth = require('../controller/authController')

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  resizeProductImages,
  UploadPrductImages,
} = require('../controller/productController');
const reviewRoute =require('./reviewRouter')
const router = express.Router();

// I-Nested Route
// Get   /products/mkjoijioqdclkj124/reviews
// Post /products/mkjoijioqdclkj124/reviews
// Get /products/mkjoijioqdclkj124/reviews/:reviewId
router.use('/:productId/reviews',reviewRoute)



router.route('/')
                .get(Auth.Protect,getProducts)
                .post(Auth.Protect,Auth.allowedTo('admin','manager'),UploadPrductImages,resizeProductImages,createProductValidator, createProduct);
router
  .route('/:id')
  .get(Auth.Protect,getProductValidator, getProduct)
  .put(Auth.Protect,Auth.allowedTo('admin'),UploadPrductImages,resizeProductImages,updateProductValidator,updateProduct)
  .delete(Auth.Protect,Auth.allowedTo('admin'),deleteProductValidator, deleteProduct);

module.exports = router;