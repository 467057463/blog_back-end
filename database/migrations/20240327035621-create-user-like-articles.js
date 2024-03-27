'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_like_articles', {
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
        references: {
          model: 'users',
          key: 'id',
        },
      },
      articleId: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        field: 'article_id',
        references: {
          model: 'articles',
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_like_articles');

  },
};
