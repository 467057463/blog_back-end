import { Controller } from 'egg';
import errorMap from '@/constant/errorMap';

export default class AuthControll extends Controller {

  get registerRule() {
    return {
      username: {
        type: 'string',
        min: 6,
        message: {
          min: '用户名长度不能小于6个字符串',
        },
      },
      password: {
        type: 'password',
      },
      confirmPassword: {
        type: 'password',
        compare: 'password',
      },
    };
  }

  get loginRule() {
    return {
      username: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
      code: {
        type: 'string',
      },
    };
  }

  async getCaptcha() {
    const { ctx, service } = this;
    const captcha = await service.user.captcha(); // 服务里面的方法
    ctx.helper.success({ ctx, res: captcha.data });
  }

  async login() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.loginRule);
    // 组装参数
    const payload = ctx.request.body || {};

    // 验证码
    const code = ctx.session.code;
    // 验证码过期
    if (code == null) {
      return ctx.helper.success({
        ctx,
        msg: errorMap[100001].message,
        code: 100001,
      });
    }
    // 验证码错误
    if (code.toLowerCase() !== payload.code.toLowerCase()) {
      return ctx.helper.success({
        ctx,
        msg: errorMap[100002].message,
        code: 100002,
      });
    }

    // 使用用户名查询用户
    const user = await service.user.findByUserame(payload.username);
    // 用户名不存在
    if (!user) {
      return ctx.helper.success({
        ctx,
        msg: errorMap[100000].message,
        code: 100000,
      });
    }
    // 匹配输入的密码
    const verifyPsw = await ctx.compare(payload.password, user.password);
    // 密码错误
    if (!verifyPsw) {
      return ctx.helper.success({
        ctx,
        msg: errorMap[100000].message,
        code: 100000,
      });
    }
    // 匹配成功，生成 token 并和 userInfo一起返回
    const token = await service.user.generateToken(user.id);

    const userInfo = await this.app.model.User.findByPk(user.id, {
      include: [
        {
          model: this.ctx.model.Profile,
          as: 'profile',
          attributes: {
            exclude: [ 'createdAt', 'updatedAt', 'user_id' ],
          },
        },
      ],
      attributes: {
        exclude: [ 'createdAt', 'updatedAt', 'password' ],
      },
    });
    ctx.helper.success({ ctx, res: { token, userInfo }, msg: '登录成功' });
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

    const userInfo = await this.app.model.User.findByPk(user.id, {
      include: [
        {
          model: this.ctx.model.Profile,
          as: 'profile',
          attributes: {
            exclude: [ 'createdAt', 'updatedAt', 'user_id' ],
          },
        },
      ],
      attributes: {
        exclude: [ 'createdAt', 'updatedAt', 'password' ],
      },
    });
    ctx.helper.success({ ctx, res: { token, userInfo }, msg: '注册成功' });
  }
}

