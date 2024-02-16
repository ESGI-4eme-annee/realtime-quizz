const Sequelize = require("sequelize");
require('dotenv').config({ path: '.env', override: true });

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DOMAIN_NAME,
  dialect: 'postgres',
});

connection
  .authenticate()
  .then(() => {
    console.log("Connexion à PostgreSQL OK.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = connection;
