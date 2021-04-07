module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('statistics', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      result: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        validate: {
          isNumeric: true
        }
      },
      testId: {
        type: Sequelize.INTEGER,
        allowNull: !this.packageId,
        validate: {
          isNumeric: true
        }
      },
      packageId: {
        type: Sequelize.INTEGER,
        allowNull: !this.testId,
        validate: {
          isNumeric: true
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('statistics');
  }
};
