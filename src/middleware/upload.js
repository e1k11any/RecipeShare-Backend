const multer = require('multer');
const AppError = require('../utils/AppError');

// We will use memory storage, which holds the file as a Buffer.
// This is efficient as we don't need to save it to disk, just
// hold it long enough to upload to Cloudinary.
const storage = multer.memoryStorage();

// File Filter: A crucial security step.
// This function ensures we only accept image files.
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/jpeg') ||
    file.mimetype.startsWith('image/png') ||
    file.mimetype.startsWith('image/webp')
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // You can add file size limits here e.g.,
  // limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = upload;
