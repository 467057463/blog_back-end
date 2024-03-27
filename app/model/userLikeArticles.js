'use strict';
module.exports = app => {
  const UserLikeArticles = app.model.define('userLikeArticles', {
    userId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      field: 'user_id',
    },
    articleId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      field: 'article_id',
    },
  });

  return UserLikeArticles;
};
