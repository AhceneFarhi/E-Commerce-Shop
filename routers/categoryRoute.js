
const express = require('express');
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require('../utils/validators/categoryValidator');

const Auth = require('../controller/authController')

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  UploadCategoryImage,
  ResizeImage,
} = require('../controller/categeryController');
const subcategoriesRoute = require('./subCategoryRoute');

const router = express.Router();

// Nested Route Definition
router.use('/:categoryId/subcategories', subcategoriesRoute);

router
  .route('/')
  .get(Auth.Protect,getCategories)
  .post(Auth.Protect,Auth.allowedTo('admin','manager' ),UploadCategoryImage,ResizeImage,createCategoryValidator, createCategory);


router
  .route('/:id')
  .get(Auth.Protect,getCategoryValidator, getCategory)
  .put(Auth.Protect,Auth.allowedTo('admin','manager'),UploadCategoryImage,ResizeImage,updateCategoryValidator, updateCategory)
  .delete(Auth.Protect,Auth.allowedTo('admin'),deleteCategoryValidator, deleteCategory);

module.exports = router;































































































// const express = require('express');
// const { VerifyTokenAndAdmin } = require('../middlewares/verifyToken');
// const multer = require('multer');
// const { CreateCategory, GetAllCategories, GetCategoriesById, UpdateCategoriesById, DeleteCategory,ApplySlugify , ApplySlugifyCreate} = require('../controller/categeryController');
// const { getCategoryValidator } = require('../utils/validators/categoryValidator');
// const router= express.Router();
// const  subCategoryRoute  = require('./subCategoryRoute')

// const upload = multer({dest:'uploads/categories'})

// router.use("/:categoryId/subcategories",subCategoryRoute)

// // ApplySlugifyCreate
// router.route('/').post(upload.single('image'),ApplySlugifyCreate,CreateCategory).get(GetAllCategories)

// router.route('/:id').get(getCategoryValidator,GetCategoriesById).put(ApplySlugify,UpdateCategoriesById).delete(DeleteCategory)




























 











// module.exports = router