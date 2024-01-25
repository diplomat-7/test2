'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('balances', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      total_amount: {
        type: Sequelize.DECIMAL,
      },
      allocated_amount: {
        type: Sequelize.DECIMAL,
      },
      iban: {
        type: Sequelize.STRING,
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id',
        },
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
    return queryInterface.dropTable('balances');
  },
};
