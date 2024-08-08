const multer = require('multer');
const path = require('path');

// Define file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = path.join(__dirname, '..', 'uploads'); 
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    callback(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Define file filter
const fileFilter = (req, file, callback) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Invalid file type. Only PNG, JPEG, JPG, and WEBP are allowed.'), false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;
