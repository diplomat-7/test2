'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const password =
      '$2b$11$tLHzzhviA2SfvyAlNReoAeOd.kQMdY1ncO6GSMgj1PNEec6ukIWUy';

    const admins = [
      {
        email: 'admin@framer.com',
        hashed_password: password,
        phone: '9661',
        phone_verified: true,
        email_verified: true,
        user_type: 'A1',
        disabled: false,
        status: 'ACTIVE',
        full_name: 'Framer Admin',
        kyc_completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        framer_id: 'A-00000000001',
        kyc_step_one_completed: true,
        kyc_step_two_completed: true,
      },
      {
        email: 'admin.a2@framer.com',
        hashed_password: password,
        phone: '9662',
        phone_verified: true,
        email_verified: true,
        user_type: 'A2',
        disabled: false,
        status: 'ACTIVE',
        full_name: 'Framer Admin Two',
        kyc_completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        framer_id: 'A-00000000002',
        kyc_step_one_completed: true,
        kyc_step_two_completed: true,
      },
      {
        email: 'admin.a3@framer.com',
        hashed_password: password,
        phone: '9663',
        phone_verified: true,
        email_verified: true,
        user_type: 'A3',
        disabled: false,
        status: 'ACTIVE',
        full_name: 'Framer Admin Three',
        kyc_completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        framer_id: 'A-00000000003',
        kyc_step_one_completed: true,
        kyc_step_two_completed: true,
      },
    ];

    await queryInterface.bulkInsert('users', admins, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
