const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite://database.sqlite');

const Test = sequelize.define('tests', {

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timeout: {
    type: DataTypes.INTEGER,
    validate: {
      isNumeric: true
    }
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
    type: DataTypes.INTEGER,
    validate: {
      isNumeric: true
    }
  },
  callbackPath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: true
    }
  }

});

module.exports = Test;