const Sequilize = require('sequelize');

const sequilize = require('../util/database');

const User = sequilize.define('user', {
  id: {
    type: Sequilize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userName: {
    type: Sequilize.STRING,
    allowNull: false,
  },
  userEmail: {
    type: Sequilize.STRING,
    allowNull: false,
  },
});

module.exports = User;