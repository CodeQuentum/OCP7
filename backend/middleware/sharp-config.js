const sharp = require('sharp');

function sharpMiddleware(req, res, next) {
  if (!req.file) {
    return next();
  }

  // Redimensionne l'image téléchargée à la taille souhaitée (par exemple, 600x800) en remplaçant l'image originale
  sharp(req.file.path)
    .resize(400, 600)
    .jpeg({ quality: 80 })
    .toBuffer()
    .then((buffer) => {
      // Remplace le contenu de l'image originale par le contenu redimensionné
      req.file.buffer = buffer;
      next();
    })
    .catch((err) => {
      console.error('Erreur lors du redimensionnement de l\'image :', err);
      return res.status(500).json({ error: 'Erreur lors du redimensionnement de l\'image' });
    });
}

module.exports = sharpMiddleware;
