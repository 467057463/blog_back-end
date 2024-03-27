'use strict';

module.exports = app => {
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
  });

  Category.associate = () => {
    Category.hasMany(app.model.Article);
  };
  return Category;
};
