/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }

//   sequelize: {
//     enable: true,
//     package: 'egg-sequelize',
//   },

//   validate: {
//     enable: true,
//     package: 'egg-validate',
//   },

//   bcrypt: {
//     enable: true,
//     package: 'egg-bcrypt',
//   },

//   jwt: {
//     enable: true,
//     package: 'egg-jwt',
//   },

//   oss: {
//     enable: true,
//     package: 'egg-oss',
//   },
// };

import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  tegg: {
    enable: true,
    package: '@eggjs/tegg-plugin',
  },
  teggConfig: {
    enable: true,
    package: '@eggjs/tegg-config',
  },
  teggController: {
    enable: true,
    package: '@eggjs/tegg-controller-plugin',
  },
  teggSchedule: {
    enable: true,
    package: '@eggjs/tegg-schedule-plugin',
  },
  eventbusModule: {
    enable: true,
    package: '@eggjs/tegg-eventbus-plugin',
  },
  aopModule: {
    enable: true,
    package: '@eggjs/tegg-aop-plugin',
  },
  tracer: {
    enable: true,
    package: 'egg-tracer',
  },

  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },

  validate: {
    enable: true,
    package: 'egg-validate',
  },

  bcrypt: {
    enable: true,
    package: 'egg-bcrypt',
  },

  jwt: {
    enable: true,
    package: 'egg-jwt',
  },

  oss: {
    enable: true,
    package: 'egg-oss',
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },
};

export default plugin;

