'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('profiles', [{
      avatar: 'blog_data_local/e4be78fa-4fe4-4578-b619-f9c316a0dfeb.png',
      name: 'mmisme',
      email: '467057463@qq.com',
      intro: '初级前端 - 摸鱼爱好者',
      site: 'www.mmisme.cn',
      github: 'github.com/467057463',
      phone: '',
      qq: '467057463',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('profiles', null, {});
  },
};
