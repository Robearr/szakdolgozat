const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite://database/database.sqlite');

const Test = sequelize.define('Test', {

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timeout: {
    type: DataTypes.INTEGER,
  },
  customErrorMessage: {
    type: DataTypes.STRING
  },
  isCustomErrorMessageVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isErrorDescriptionVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isStackVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  points: {
    type: DataTypes.INTEGER
  },
  callbackPath: {
    type: DataTypes.STRING,
    allowNull: false
  },

});

module.exports = Test;