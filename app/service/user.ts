import { Service } from 'egg';

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
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
    }, ctx.app.config.jwt.secret);
  }
}
