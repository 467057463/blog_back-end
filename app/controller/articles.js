const { Controller } = require('egg');

class ArticleController extends Controller {
  get indexQueryRule() {
    return {
      limit: 'int',
      page: 'int',
    };
  }

  get createArticleRule() {
    return {
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
    };
  }

  async index() {
    const { ctx } = this;
    // 校验参数
    ctx.validate(this.indexQueryRule, ctx.query);
    ctx.body = await ctx.service.article.findArticleList(ctx.query);
  }

  async show() {
    const { ctx } = this;
    const article = await ctx.service.article.findById(ctx.params.id);
    if (!article) {
      // ctx.status = 404;
      ctx.throw(404, 'article not found');
    } else {
      ctx.body = article;
      ctx.status = 201;
    }
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

  async update() {
    const { ctx } = this;
    const user = ctx.state.user;
    const article = await ctx.service.article.findById(ctx.params.id);
    if (!article || article.authorId !== user.data.id) {
      // ctx.status = 404;
      ctx.throw(404, 'article not found');
      return;
    }

    // 校验参数
    ctx.validate(this.createArticleRule);

    await article.update(ctx.request.body);

    ctx.body = article;
  }

  async destroy() {
    const { ctx } = this;
    const user = ctx.state.user;
    const article = await ctx.service.article.findById(ctx.params.id);
    if (!article || article.authorId !== user.data.id) {
      // ctx.status = 404;
      ctx.throw(404, 'article not found');
      return;
    }

    await article.destroy();
    ctx.status = 200;
  }

  async like() {
    const { ctx } = this;
    const userId = ctx.state.user.data.id;
    const article = await ctx.service.article.findById(ctx.params.id);

    if (!article) {
      ctx.throw(404, 'article not found');
      return;
    }

    const user = await this.app.model.User.findByPk(userId);

    if (await article.hasLikeUser(user)) {
      ctx.throw(404, 'you alery like');
      return;
    }

    article.addLikeUser(user);
    ctx.body = 'success';
  }
}

module.exports = ArticleController;
