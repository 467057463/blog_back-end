'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('profiles', {
      fields: [ 'user_id' ],
      type: 'foreign key',
      name: 'profiles_user_id_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('profiles', 'profiles_user_id_fkey');
  },
};
