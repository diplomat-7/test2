'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('wathqs', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      cr_city: {
        type: Sequelize.STRING,
      },
      cr_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSON,
      },
      cr_creation_date: {
        type: Sequelize.STRING,
      },
      cr_expiry_date: {
        type: Sequelize.STRING,
      },
      company_legal_name: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('wathqs');
  },
};
