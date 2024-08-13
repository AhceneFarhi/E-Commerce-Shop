const express = require('express');

const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require('../controller/subCategoryController');

const Auth = require('../controller/authController');

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require('../utils/validators/subcategoryValidator');

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(Auth.Protect,Auth.allowedTo('admin'),setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(Auth.Protect, createFilterObj, getSubCategories);
router
  .route('/:id')
  .get(Auth.Protect,getSubCategoryValidator, getSubCategory)
  .put(Auth.Protect,Auth.allowedTo('admin'),updateSubCategoryValidator, updateSubCategory)
  .delete(Auth.Protect,Auth.allowedTo('admin'),deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;