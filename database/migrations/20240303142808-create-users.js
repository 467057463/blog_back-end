'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.DataTypes.STRING(16),
        field: 'username',
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING(64),
        field: 'password',
        allowNull: false,
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
    await queryInterface.dropTable('users');
  },
};
