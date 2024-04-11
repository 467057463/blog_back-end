import { Controller } from 'egg';

export default class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(this.app.config);
    ctx.body = 'hi, eggs /n';
    ctx.helper.success({ ctx, res: ctx.state.user.data.id });
  }
}

