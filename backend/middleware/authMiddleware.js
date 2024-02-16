const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local', override: true });

function authMiddleware(req, res, next) {
    // Récupérer le cookie 'token'
    const token = req.cookies["token"];

    // Vérifier si le cookie est présent
    if (!token) {
        return res.status(401).json({ error: 'Authentification requise !' });
    }

    try {
        // Vérifier et décoder le jeton
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userToken = decodedToken.userToken; // Ajouter l'ID de l'utilisateur à la requête

        // Passer au middleware suivant
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide !' });
    }
}

module.exports = authMiddleware;
