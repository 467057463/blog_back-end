/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
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
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1706712360203_3983';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  // add your user config here
  const userConfig = {
    IMG_HOST: 'https://img.mmisme.cn',
  };

  return {
    ...config,
    ...userConfig,
  };
};
