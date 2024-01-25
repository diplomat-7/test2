'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    let vibans = [];

    for (let i = 0; i < 50; i++) {
      let paddedI = i.toString().padStart(2, '0');
      vibans.push({
        used: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        viban: 'SA8220EC00789907000000' + paddedI,
      });
    }

    await queryInterface.bulkInsert('vibans', vibans, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vibans', null, {});
  },
};
