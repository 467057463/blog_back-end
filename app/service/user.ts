import { Service } from 'egg';
import svgCaptcha from 'svg-captcha';

export default class User extends Service {
  async create(user) {
    user.password = await this.ctx.genHash(user.password);
    return this.app.model.User.create(user);
  }

  findByUserame(username: string) {
    return this.app.model.User.findOne({ where: { username } });
  }

  generateToken(id) {
    const { ctx } = this;
    return ctx.app.jwt.sign({
      data: {
        id,
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
    }, ctx.app.config.jwt.secret);
  }


  // 产生验证码
  async captcha() {
    const captcha = svgCaptcha.createMathExpr({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      color: true,
      noise: 4,
      ignoreChars: '0o1i',
      // bacground: '#cc9966',
    });
    this.ctx.session.code = captcha.text;
    return captcha;
  }
}
