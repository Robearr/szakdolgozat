module.exports = {
  up:  (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('tests', [
      {
        name: 'Négyzet számolása',
        timeout: 10000,
        customErrorMessage: 'Nem jók a négyzetszámok!',
        isCustomErrorMessageVisible: true,
        isErrorDescriptionVisible: true,
        isStackVisible: true,
        points: 3,
        packageId: 1,
        callbackPath: 'tests/squareCalculatorCheck.js',
      },
      {
        name: 'Páros számok',
        timeout: 10000,
        customErrorMessage: 'Nem párosak a számok!',
        isCustomErrorMessageVisible: true,
        isErrorDescriptionVisible: false,
        isStackVisible: false,
        points: 3,
        packageId: 1,
        callbackPath: 'tests/evenNumbersChecker.js',
      },

      {
        name: 'Gomb click konzolra',
        timeout: 10000,
        customErrorMessage: 'Nem íródott ki a konzolra!',
        isCustomErrorMessageVisible: true,
        isErrorDescriptionVisible: false,
        isStackVisible: false,
        points: 5,
        packageId: 1,
        callbackPath: 'tests/buttonClicked.js',
      },
      {
        name: 'Minden span szövege lecserélve',
        timeout: 10000,
        customErrorMessage: 'Nem lett lecserélve minden span szövege!',
        isCustomErrorMessageVisible: true,
        isErrorDescriptionVisible: false,
        isStackVisible: false,
        points: 5,
        packageId: 1,
        callbackPath: 'tests/everySpansText.js',
      },
      {
        name: 'Háttérszín változtatás',
        timeout: 10000,
        customErrorMessage: 'Nem jó a háttérszín!',
        isCustomErrorMessageVisible: true,
        isErrorDescriptionVisible: false,
        isStackVisible: false,
        points: 5,
        packageId: 1,
        callbackPath: 'tests/changeBackgroundColor.js',
      },
    ], {});
  },

  down:  (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tests', null, {});
  }
};
