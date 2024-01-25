'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('wallets', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      amount_used: {
        type: Sequelize.DECIMAL,
      },
      allocated_amount: {
        type: Sequelize.DECIMAL,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      framer_id: {
        type: Sequelize.STRING,
      },
      balance_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'balances',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('wallets');
  },
};
