import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {
    security: {
      csrf: {
        enable: false,
      },
    },

    jwt: {
      secret: 'jwt-123qweasd',
      enable: true, // default is false
      match: '/jwt', // optional
    },

    validate: {
      convert: true,
    },

    bcrypt: {
      saltRounds: 10, // default 10
    },

    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: true,
    },
  } as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1706712360203_3983';

  // add your egg config in here
  config.middleware = [ 'errorHandler' ];

  // add your special config in here
  const bizConfig = {
    IMG_HOST: 'https://img.mmisme.cn',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};

