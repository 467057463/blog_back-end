export default app => {

  const Tag = app.model.define('tag', {
    id: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: app.Sequelize.DataTypes.STRING,
      field: 'name',
      allowNull: false,
      unique: true,
    },
  });

  Tag.associate = () => {
    Tag.belongsToMany(app.model.Article, {
      through: app.model.ArticleTag,
    });
  };

  return Tag;
};
