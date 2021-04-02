require('dotenv').config();

const dbConfig = {
  dbUserName: process.env.DATABASE_USERNAME,
  dbName: process.env.DATABASE_NAME,
  dbPassword: process.env.DATABASE_PASSWORD,
  mailApi: process.env.MAIL_GUN_API,
  mailDomain: process.env.MAIL_GUN_DOMAIN,
};

module.exports = dbConfig;
