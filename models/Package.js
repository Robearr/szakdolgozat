const { Sequelize, DataTypes } = require('sequelize');
const Test = require('./Test.js');

const sequelize = new Sequelize('sqlite://database/database.sqlite');

const Package = sequelize.define('Package', {

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

Package.tests = Package.hasMany(Test);


module.exports = Package;