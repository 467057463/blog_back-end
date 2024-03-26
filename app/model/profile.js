'use strict';

module.exports = app => {
  // const { STRING, INTEGER, DATE } = app.Sequelize;

  const Profile = app.model.define('profile', {
    id: {
      type: app.Sequelize.DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: app.Sequelize.DataTypes.STRING(16),
    },
    avatar: {
      type: app.Sequelize.DataTypes.STRING,
    },
    email: {
      type: app.Sequelize.DataTypes.STRING(32),
      unique: true,
    },
    intro: {
      type: app.Sequelize.DataTypes.TEXT,
    },
    site: {
      type: app.Sequelize.DataTypes.STRING(32),
    },
    github: {
      type: app.Sequelize.DataTypes.STRING,
    },
    phone: {
      type: app.Sequelize.DataTypes.STRING,
    },
    qq: {
      type: app.Sequelize.DataTypes.STRING,
    },
    createdAt: {
      type: app.Sequelize.DataTypes.DATE,
    },
    updatedAt: {
      type: app.Sequelize.DataTypes.DATE,
    },
  });

  Profile.associate = () => {
    Profile.belongsTo(app.model.User, {
      as: 'user',
      foreignKey: 'user_id',
    });
  };

  return Profile;
};
