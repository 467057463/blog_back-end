module.exports = () => {
  return {
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
        accessKeyId: 'LTAI5t9xcboV5FFEgx2ngU9y',
        accessKeySecret: 'CuMyaOEPpzNnCKqL0ozFpmC3JtUFKA',
        bucket: 'mmismeblog',
        endpoint: 'oss-cn-wuhan-lr.aliyun.com',
        timeout: '60s',
      },
    },
  };
};
