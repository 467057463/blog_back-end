'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      username: 'mmisme',
      password: '$2a$10$a6QdDHsmPjf0sPvIheTVBemIK9OeMAmAvE.0GUy.uoAkxnBN6/sYq',
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
