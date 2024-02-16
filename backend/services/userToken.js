const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { logger } = require("sequelize/lib/utils/logger");

function getConnectedUser(token) {
    if (!token) {
        return null;
    }

    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const userEmail = decoded.userEmail;

            // Rechercher l'utilisateur correspondant à l'ID
            User.findOne({ where: { email: userEmail } })
                .then((user) => {
                    if (!user) {
                        reject({ error: "User not found" });
                    }
                    resolve(user.id);
                })
                .catch((error) => {
                    reject({ error: error.message });
                });
        } catch (error) {
            reject({ error: "Invalid token" });
        }
    });
}

module.exports = { getConnectedUser };
