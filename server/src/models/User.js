const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite://database.sqlite');

const User = sequelize.define('users', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlpha: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isTeacher: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isIn: [[0, 1, true, false]]
    }
  }
});

module.exports = User;