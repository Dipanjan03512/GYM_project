const multer = require('multer');
const path = require('path');

// Define file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = path.join(__dirname, '..', 'Uploads');
    callback(null, uploadDir, (err) => {
      if (err) throw err;
    });
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname, (err) => {
      if (err) throw err;
    });
  }
});

// Define file filter
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype.includes('png') ||
    file.mimetype.includes('jpg') ||
    file.mimetype.includes('jpeg') ||
    file.mimetype.includes('webp')
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

// Set up multer with storage, file filter, and size limit
const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fieldSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = upload;
