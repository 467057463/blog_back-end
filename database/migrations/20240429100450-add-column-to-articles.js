'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('articles', 'raw', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('articles', 'describe', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('articles', 'raw', { transaction: t }),
        queryInterface.removeColumn('articles', 'describe', { transaction: t }),
      ]);
    });
  },
};
