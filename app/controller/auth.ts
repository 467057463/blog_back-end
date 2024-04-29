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
      // ctx.throw(404, 'user not found');
      return ctx.helper.success({ ctx, msg: errorMap[100000].message, code: 100000 });
    }
    // 匹配输入的密码
    const verifyPsw = await ctx.compare(payload.password, user.password);
    if (!verifyPsw) {
      return ctx.helper.success({ ctx, msg: errorMap[100000].message, code: 100000 });
    }
    // 匹配成功，生成 token
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

