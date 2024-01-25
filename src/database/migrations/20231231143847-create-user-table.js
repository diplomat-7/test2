'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      hashed_password: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
      },
      user_type: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      otp: {
        type: Sequelize.STRING,
      },
      date_of_birth: {
        type: Sequelize.STRING,
      },
      otp_secret_key: {
        type: Sequelize.STRING,
      },
      otp_sent_at: {
        type: Sequelize.DATE,
      },
      id_number: {
        type: Sequelize.STRING,
      },
      disabled: {
        type: Sequelize.BOOLEAN,
      },
      full_name: {
        type: Sequelize.STRING,
      },
      email_verification_code: {
        type: Sequelize.STRING,
      },
      framer_id: {
        type: Sequelize.STRING,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
      },
      kyc_step_one_completed: {
        type: Sequelize.BOOLEAN,
      },
      kyc_step_two_completed: {
        type: Sequelize.BOOLEAN,
      },
      phone_verified: {
        type: Sequelize.BOOLEAN,
      },
      kyc_completed: {
        type: Sequelize.BOOLEAN,
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      deletedAt: {
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
    return queryInterface.dropTable('users');
  },
};
