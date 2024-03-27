'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', [{
      name: 'technology',
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      name: 'life',
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
