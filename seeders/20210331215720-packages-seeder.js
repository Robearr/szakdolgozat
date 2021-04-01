module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('packages', [{
      name: 'Szimpla tesztcsomag',
      description: 'Egy egyszerű tesztcsomag, ami pár alap tesztet tartalmaz magában, hogy a normális működést le tudjam ellenőrizni.',
      isActive: true,
      availableFrom: null,
      availableTo: null,
      needsAuth: false,
      ipMask: null,
      urlMask: null,
      timeout: null,
      createdAt: new Date(),
      // hooks: {

      // },
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('packages', null, {});
  }
};
