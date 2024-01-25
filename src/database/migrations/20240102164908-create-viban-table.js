'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('vibans', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      used: {
        type: Sequelize.BOOLEAN,
      },
      viban: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('vibans');
  },
};
