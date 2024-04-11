export default app => {
  const ArticleTag = app.model.define('articleTag', {
    tagId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      field: 'tag_id',
    },
    articleId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      field: 'article_id',
    },
  });

  return ArticleTag;
};
