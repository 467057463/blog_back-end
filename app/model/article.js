module.exports = app => {
  const Article = app.model.define('article', {
    id: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: app.Sequelize.DataTypes.STRING(16),
      allowNull: false,
    },
    content: {
      type: app.Sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: app.Sequelize.DataTypes.DATE,
    },
    updatedAt: {
      type: app.Sequelize.DataTypes.DATE,
    },
    authorId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    categoryId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });

  Article.associate = () => {
    Article.belongsTo(app.model.User, {
      as: 'author',
      foreignKey: 'author_id',
    });

    Article.belongsToMany(app.model.User, {
      through: app.model.UserLikeArticle,
      as: 'likeUsers',
    });

    Article.belongsToMany(app.model.Tag, {
      through: app.model.ArticleTag,
      as: 'tags',
    });

    Article.belongsTo(app.model.Category, {
      as: 'category',
      foreignKey: 'category_id',
    });
  };

  return Article;
};
