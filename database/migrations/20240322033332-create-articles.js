'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('articles', {
      id: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.DataTypes.STRING(64),
        field: 'title',
      },
      content: Sequelize.DataTypes.TEXT,
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        field: 'author_id',
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('articles');
  },
};
