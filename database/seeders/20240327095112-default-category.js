'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', [{
      name: 'technology',
      label: '技术',
      order: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'life',
      label: '生活',
      order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
