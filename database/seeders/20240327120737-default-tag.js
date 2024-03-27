'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('tags', [
      {
        name: 'electron',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'css',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'javascript',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tags', null, {});
  },
};
