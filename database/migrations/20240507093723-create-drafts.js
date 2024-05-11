'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('drafts', {
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
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
      },
      authorId: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        field: 'author_id',
        references: {
          model: 'users',
          key: 'id',
        },
        comment: '作者id',
      },
      articleId: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        field: 'article_id',
        references: {
          model: 'articles',
          key: 'id',
        },
        comment: '文章id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('drafts');
  },
};
