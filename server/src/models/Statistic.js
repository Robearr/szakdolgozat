const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite://database.sqlite');

const Statistic = sequelize.define('statistics', {
  result: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: true
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    validate: {
      isNumeric: true
    }
  },
  userName: {
    type: DataTypes.STRING
  },
  testId: {
    type: DataTypes.INTEGER,
    allowNull: !this.packageId,
    validate: {
      isNumeric: true,
    }
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: !this.testId,
    validate: {
      isNumeric: true
    }
  }
});

module.exports = Statistic;