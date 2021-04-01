module.exports = {
  up:  (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('tests', [
      {
        name: 'vehicle 1 id exists',
        timeout: 10000,
        customErrorMessage: 'Nem létezik a `vehicle1` id-jú elem!',
        isCustomErrorMessageVisible: true,
        isErrorDescriptionVisible: false,
        isStackVisible: false,
        points: 5,
        callbackPath: 'tests/vehicle1IdExists.js',
        createdAt: new Date()
      },
      {
        name: 'vehicle 1 check',
        timeout: 10000,
        customErrorMessage: 'Ennek nem kéne megjelennie!',
        isCustomErrorMessageVisible: false,
        isErrorDescriptionVisible: false,
        isStackVisible: false,
        points: 5,
        callbackPath: 'tests/vehicle1Check.js',
        createdAt: new Date()
      }
    ], {});
  },

  down:  (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tests', null, {});
  }
};
