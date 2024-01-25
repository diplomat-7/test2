'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('email_sms_managements', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      receiver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
      },
      sender: {
        type: Sequelize.STRING,
      },
      template: {
        type: Sequelize.STRING,
      },
      retry_count: {
        type: Sequelize.INTEGER,
      },
      sent_at: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('email_sms_managements');
  },
};
