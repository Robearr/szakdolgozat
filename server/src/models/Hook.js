const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite://database.sqlite');

const Hook = sequelize.define('hooks', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['beforeTest', 'afterTest', 'beforePackage', 'afterPackage']] // TODO: kiegészíteni?
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

module.exports = Hook;