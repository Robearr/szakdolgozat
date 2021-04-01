const { Sequelize, DataTypes } = require('sequelize');
const Test = require('./Test');

const sequelize = new Sequelize('sqlite://database.sqlite');

const Package = sequelize.define('packages', {

  name: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN
  },
  availableFrom: {
    type: DataTypes.DATE
  },
  availableTo: {
    type: DataTypes.DATE
  },
  needsAuth: {
    type: DataTypes.BOOLEAN
  },
  ipMask: {
    type: DataTypes.STRING
  },
  urlMask: {
    type: DataTypes.STRING
  },
  timeout: {
    type: DataTypes.INTEGER
  },

  // hooks: {
  //
  // },

});

module.exports = Package;