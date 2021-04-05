module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tests', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timeout: {
        type: Sequelize.INTEGER,
      },
      customErrorMessage: {
        type: Sequelize.STRING
      },
      isCustomErrorMessageVisible: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isErrorDescriptionVisible: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isStackVisible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      points: {
        type: Sequelize.INTEGER
      },
      callbackPath: {
        type: Sequelize.STRING,
        allowNull: false
      },
      packageId: {
        type: Sequelize.INTEGER,
        allowNull: false
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tests');
  }
};
