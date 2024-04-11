import { Application } from 'egg';

export default (app: Application) => {
  app.validator.addRule('password', (_, value) => {
    const reg = /\d+/;
    if (!reg.test(value)) {
      return '请输入正确的密码';
    }
  });
};
