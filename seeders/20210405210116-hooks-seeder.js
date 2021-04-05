module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('hooks', [{
      type: 'beforeTest',
      callbackPath: 'hooks/beforeTest.js',
      packageId: 1
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('hooks', null, {});
  }
};
