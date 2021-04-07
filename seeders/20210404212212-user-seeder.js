module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        name: 'admin',
        password: '21232f297a57a5a743894a0e4a801fc3',
        isTeacher: true,
        createdAt: new Date()
      },
      {
        name: 'test',
        password: 'ee11cbb19052e40b07aac0ca060c23ee',
        isTeacher: false,
        createdAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
