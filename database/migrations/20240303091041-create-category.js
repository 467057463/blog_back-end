'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        field: 'name',
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
