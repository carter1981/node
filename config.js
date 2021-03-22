require('dotenv').config();

module.exports = dbConfig = {
  dbUserName: process.env.DATABASE_USERNAME,
  dbName: process.env.DATABASE_NAME,
  dbPassword: process.env.DATABASE_PASSWORD,
};