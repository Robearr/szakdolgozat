const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite://database.sqlite');

const Package = sequelize.define('packages', {

  name: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
    validate: {
      isIn: [[0, 1, true, false]]
    }
  },
  availableFrom: {
    type: DataTypes.DATE,
    defaultValue: Date.now()
  },
  availableTo: {
    type: DataTypes.DATE
  },
  needsAuth: {
    type: DataTypes.BOOLEAN,
    validate: {
      isIn: [[0, 1, true, false]]
    }
  },
  ipMask: {
    type: DataTypes.STRING
  },
  urlMask: {
    type: DataTypes.STRING
  },
  timeout: {
    type: DataTypes.INTEGER,
    validate: {
      isNumeric: true
    }
  },

  // hooks: {
  //
  // },

});

module.exports = Package;