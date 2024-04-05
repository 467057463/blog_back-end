module.exports = () => {
  return {
    sequelize: {
      username: 'root',
      password: 'nandudu_',
      database: 'blog_stage',
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
    },
  };
};
