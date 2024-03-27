'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('article_tags', {
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
      },
      tagId: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        field: 'tag_id',
        references: {
          model: 'tags',
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
    await queryInterface.dropTable('article_tags');
  },
};
