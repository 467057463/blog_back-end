export default app => {
  const Draft = app.model.define('draft', {
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
    articleId: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
    },
  });

  Draft.associate = () => {
    Draft.belongsTo(app.model.User, {
      as: 'author',
      foreignKey: 'author_id',
    });

    Draft.belongsTo(app.model.Article, {
      as: 'article',
      foreignKey: 'article_id',
    });
  };

  return Draft;
};
