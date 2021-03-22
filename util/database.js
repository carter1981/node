const Sequelize = require('sequelize');

const dbConfig = require('../config');

const sequelize = new Sequelize(dbConfig.dbName, dbConfig.dbUserName, dbConfig.dbPassword, {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
