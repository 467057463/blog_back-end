const { Controller } = require('egg');

class ArticleController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = await ctx.model.Article.findAll({ include: ctx.model.User, as: 'author_id' });
  }

  async create() {
    const { ctx } = this;
    const { title, content } = ctx.request.body;
    const user = ctx.state.user;
    const article = await ctx.model.Article.create({
      title,
      content,
      authorId: user.data.id,
    });

    ctx.status = 201;
    ctx.body = article;
  }
}

module.exports = ArticleController;
