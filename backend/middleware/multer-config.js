const multer = require('multer');
const sharp = require('sharp'); 

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.memoryStorage(); 

const fileFilter = (req, file, callback) => {
  const isValidMimeType = MIME_TYPES[file.mimetype];
  if (isValidMimeType) {
    callback(null, true);
  } else {
    callback(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('image');

module.exports = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    if (req.file) {
      sharp(req.file.buffer)
        .resize(400, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 70 })
        .toFile(`images/${req.file.filename}`, (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          next();
        });
    } else {
      next();
    }
  });
};