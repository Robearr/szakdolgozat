module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        name: 'admin',
        password: 'bced6fd149cfcdb85741768da12e41c6',
        isTeacher: true,
        createdAt: new Date()
      },
      {
        name: 'test',
        password: '3de1d73a19c7590ee66398a17e93bd67',
        isTeacher: false,
        createdAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
