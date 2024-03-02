module.exports = appInfo => {
  return {
    // databasename: 'accelerator_development',
    sequelize: {
      dialect: 'mysql',
      password: 'nandudu_',
      host: '127.0.0.1',
      port: 3306,
      database: 'learning_development',
    },
  };
};
