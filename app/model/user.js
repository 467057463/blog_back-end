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
      validate: {
        len: [ 6 ],
      },
    },
    password: {
      type: app.Sequelize.DataTypes.STRING(64),
      allowNull: false,
    },
    isAdmin: {
      type: app.Sequelize.DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
