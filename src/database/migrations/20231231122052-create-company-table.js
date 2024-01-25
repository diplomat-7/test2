'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('companies', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      cr_number: {
        type: Sequelize.STRING,
      },
      vat_number: {
        type: Sequelize.STRING,
      },
      cr_creation_date: {
        type: Sequelize.STRING,
      },
      framer_id: {
        type: Sequelize.STRING,
      },
      cr_expiry_date: {
        type: Sequelize.STRING,
      },
      cr_city: {
        type: Sequelize.STRING,
      },
      kyc_verifier: {
        type: Sequelize.JSON,
      },
      kyc_verification_code: {
        type: Sequelize.STRING,
      },
      company_legal_name: {
        type: Sequelize.STRING,
      },
      vat_cert_accepted: {
        type: Sequelize.BOOLEAN,
      },
      auth_letter_accepted: {
        type: Sequelize.BOOLEAN,
      },
      kyc_verified: {
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('companies');
  },
};
