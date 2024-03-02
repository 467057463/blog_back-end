const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(this.app.config);
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
