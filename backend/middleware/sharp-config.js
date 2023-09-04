const sharp = require('sharp');

function sharpMiddleware(req, res, next) {
  if (!req.file) {
    return next();
  }

  sharp(req.file.path)
    .resize(400, 600)
    .jpeg({ quality: 80 })
    .toBuffer()
    .then((buffer) => {

      req.file.buffer = buffer;
      next();
    })
    .catch((err) => {
      console.error('Erreur lors du redimensionnement de l\'image :', err);
      return res.status(500).json({ error: 'Erreur lors du redimensionnement de l\'image' });
    });
}

module.exports = sharpMiddleware;
