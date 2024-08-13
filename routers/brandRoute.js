const express = require('express');
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require('../utils/validators/brandValidator');

const Auth = require('../controller/authController')

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  UploadBrandImage,
  ResizeImage,
} = require('../controller/brandController');

const router = express.Router();

router.use(Auth.Protect,Auth.verifyIfUserActive,Auth.allowedTo('admin' )) // User must be : logged in , active  , admin

router.route('/')
                .get(getBrands)
                .post(UploadBrandImage,ResizeImage,createBrandValidator, createBrand);

router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(UploadBrandImage,ResizeImage,updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;