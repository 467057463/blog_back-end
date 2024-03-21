module.exports = app => {
  app.validator.addRule('password', (rule, value) => {
    const reg = /\d+/;
    if (!reg.test(value)) {
      return '请输入正确的密码';
    }
  });
};
