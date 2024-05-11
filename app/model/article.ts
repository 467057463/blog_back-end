import dayjs from 'dayjs';

export default app => {
  const Article = app.model.define('article', {
    id: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cover: {
      type: app.Sequelize.DataTypes.STRING,
      get() {
        const val = (this as any).getDataValue('cover');
        if (val) {
          return app.config.IMG_HOST + '/' + val;
        }
        return '';
      },
    },
    title: {
      type: app.Sequelize.DataTypes.STRING(16),
      allowNull: false,
    },
    content: {
      type: app.Sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    describe: {
      type: app.Sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: app.Sequelize.DataTypes.DATE,
      get() {
        const rawValue = (this as any).getDataValue('createdAt');
        return rawValue ? dayjs(rawValue).format('YYYY-MM-DD HH:mm') : null;
      },
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

    Article.hasOne(app.model.Draft);
  };

  return Article;
};
