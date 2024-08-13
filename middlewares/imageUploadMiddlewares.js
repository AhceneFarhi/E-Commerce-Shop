


const multer = require('multer');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'



const multerOptions = () => {

    const multerStorage = multer.memoryStorage();
  
    const multerFilter = function (req, file, cb) {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb(new ApiError('Only Images allowed', 400), false);
      }
    };
  
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  
    return upload;
  };


// 2- Memory Storage engine
exports.UploadSingleImage = (fieldName)=> multerOptions().single(fieldName)
 



exports.uploadMultipleImages = (arrayOfFields)=>    multerOptions().fields(arrayOfFields);
















// // 1- DiskStorage engine
// const multerStorage=multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/categories')
//     },
//     filename: function (req, file, cb) {
//       const ext = file.mimetype.split('/')[1]  // extension of filename (jpg or png)
//       const filename = `category-${uuidv4()}-${Date.now()}.${ext}`  // Build a unique filename
//       cb(null, filename)
//     }
// })






























































































