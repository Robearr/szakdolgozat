module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('packages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      availableFrom: {
        type: Sequelize.DATE
      },
      availableTo: {
        type: Sequelize.DATE
      },
      needsAuth: {
        type: Sequelize.BOOLEAN
      },
      ipMask: {
        type: Sequelize.STRING
      },
      urlMask: {
        type: Sequelize.STRING
      },
      timeout: {
        type: Sequelize.INTEGER
      },
      // hooks: {
      //
      // },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('packages');
  }
};
