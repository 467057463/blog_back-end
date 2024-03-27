'use strict';
module.exports = app => {
  const UserLikeArticle = app.model.define('userLikeArticle', {
    userId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      field: 'user_id',
    },
    articleId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      field: 'article_id',
    },
  });

  return UserLikeArticle;
};
