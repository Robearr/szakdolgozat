module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('statistics', [
      {
        result: 21,
        userId: 1,
        userName: 'admin',
        packageId: 1
      },
      {
        result: 10,
        userId: 2,
        userName: 'user',
        packageId: 1
      },
      {
        result: 15,
        packageId: 1
      },
      {
        result: 3,
        testId: 1
      },
      {
        result: 3,
        userId: 1,
        userName: 'admin',
        testId: 1
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('statistics', null, {});
  }
};
