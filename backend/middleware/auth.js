const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       console.log("Token:", token); // Vérifiez si le token est correctement extrait
       
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       console.log("Decoded Token:", decodedToken); // Vérifiez le contenu du token décodé
       
       const userId = decodedToken.userId;
       console.log("User ID:", userId); // Vérifiez si l'ID utilisateur est correctement extrait
       
       req.auth = {
           userId: userId
       };
       next();
   } catch(error) {
       console.error("Authentication Error:", error); // Vérifiez les erreurs liées à l'authentification
       res.status(401).json({ error });
   }
};
