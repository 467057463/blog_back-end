export default app => {
  const Category = app.model.define('category', {
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
    label: {
      type: app.Sequelize.DataTypes.STRING,
      field: 'label',
      allowNull: false,
      unique: true,
    },
    order: {
      type: app.Sequelize.DataTypes.INTEGER,
      field: 'order',
      allowNull: false,
    },
  });

  Category.associate = () => {
    Category.hasMany(app.model.Article);
  };
  return Category;
};
