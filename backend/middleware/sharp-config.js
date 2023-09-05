const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function sharpMiddleware(req, res, next) {
  if (!req.file) {
    return next();
  }
  
  sharp(req.file.buffer)
    .resize(400, 600)
    .jpeg({ quality: 80 })
    .toBuffer()
    .then((buffer) => {

      const uniqueFileName = generateUniqueFileName();
      const imagePath = path.join(__dirname, '..', 'images', uniqueFileName);
      fs.writeFileSync(imagePath, buffer);
      req.file.filename = uniqueFileName;
      next();
    })
    .catch((err) => {
      console.error('Erreur lors du redimensionnement de l\'image :', err);
      return res.status(500).json({ error: 'Erreur lors du redimensionnement de l\'image' });
    });
}

function generateUniqueFileName() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `image_${timestamp}_${randomString}.jpeg`;
}

module.exports = sharpMiddleware;
