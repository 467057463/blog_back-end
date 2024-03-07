'use strict';

module.exports = app => {
  // const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: app.Sequelize.DataTypes.STRING(16),
      allowNull: false,
      unique: true,
    },
    password: {
      type: app.Sequelize.DataTypes.STRING(32),
      allowNull: false,
    },
    createdAt: {
      type: app.Sequelize.DataTypes.DATE,
    },
    updatedAt: {
      type: app.Sequelize.DataTypes.DATE,
    },
  });

  User.associate = () => {
    User.hasOne(app.model.Profile, {
      as: 'profile',
      foreignKey: 'user_id',
    });
  };

  return User;
};
