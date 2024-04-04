const { Controller } = require('egg');

class AuthControll extends Controller {

  get registerRule() {
    return {
      username: {
        type: 'string',
        min: 6,
        required: true,
        allowEmpty: false,
        message: {
          min: '用户名长度不能小于6个字符串',
        },
      },
      password: {
        type: 'password',
        required: true,
        allowEmpty: false,
      },
      confirmPassword: {
        type: 'password',
        compare: 'password',
        required: true,
        allowEmpty: false,
      },
    };
  }

  get loginRule() {
    return {
      username: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
      password: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
    };
  }

  async login() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.loginRule);
    // 组装参数
    const payload = ctx.request.body || {};

    // 使用用户名查询用户
    const user = await service.user.findByUserame(payload.username);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    // 匹配输入的密码
    const verifyPsw = await ctx.compare(payload.password, user.password);
    if (!verifyPsw) {
      ctx.throw(404, 'user password is error');
    }
    // 匹配成功，生成 token
    const token = await service.user.generateToken(user.id);
    ctx.helper.success({ ctx, res: token, msg: '登录成功' });
  }

  async register() {
    const { ctx, service } = this;
    // 验证参数
    ctx.validate(this.registerRule);
    // 组装参数
    const payload = ctx.request.body || {};
    // 创建用户
    const user = await service.user.create(payload);
    // 生成 token
    const token = await service.user.generateToken(user.id);
    ctx.helper.success({ ctx, res: token, msg: '注册成功' });
  }
}

module.exports = AuthControll;
