module.exports = () => {
  return {
    IMG_HOST: 'https://img.mmisme.cn',
    sequelize: {
      username: 'root',
      password: 'nandudu_',
      database: 'blog_development',
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
    },
    oss: {
      client: {
        accessKeyId: '1',
        accessKeySecret: '1',
        bucket: '1',
        endpoint: '1',
        timeout: '1',
      },
    },
  };
};
