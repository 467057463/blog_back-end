'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
      name: {
        type: Sequelize.DataTypes.STRING(16),
        field: 'name',
      },
      avatar: {
        type: Sequelize.DataTypes.STRING,
        field: 'avatar',
      },
      email: {
        type: Sequelize.DataTypes.STRING(32),
        field: 'email',
        primaryKey: true,
        unique: true,
      },
      intro: {
        type: Sequelize.DataTypes.TEXT,
        field: 'intro',
      },
      site: {
        type: Sequelize.DataTypes.STRING(32),
        field: 'site',
      },
      github: {
        type: Sequelize.DataTypes.STRING,
        field: 'github',
      },
      phone: {
        type: Sequelize.DataTypes.STRING,
        field: 'phone',
      },
      qq: {
        type: Sequelize.DataTypes.STRING,
        field: 'qq',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        field: 'user_id',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profiles');
  },
};
