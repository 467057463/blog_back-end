module.exports = () => {
  return {
    sequelize: {
      username: 'root',
      dialect: 'mysql',
      password: 'nandudu_',
      host: '127.0.0.1',
      port: 3306,
      database: 'blog_production',
    },
  };
};
