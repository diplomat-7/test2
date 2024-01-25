'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('transactions', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
      },
      approved: {
        type: Sequelize.BOOLEAN,
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
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallets',
          key: 'id',
        },
      },
      bank_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'banks',
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
    return queryInterface.dropTable('transactions');
  },
};
