const { Controller } = require('egg');

class ArticleController extends Controller {
  get indexQueryRule() {
    return {
      limit: 'int',
      page: 'int',
      categoryId: 'int',
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
      categoryId: {
        type: 'int',
      },
    };
  }

  async index() {
    const { ctx } = this;
    // 校验参数
    ctx.validate(this.indexQueryRule, ctx.query);
    ctx.body = await ctx.service.article.findArticleList(ctx.query);

    // if (ctx.query.tag) {
    //   ctx.body = await ctx.service.article.findArticleByTag(ctx.query);
    // } else {
    //   ctx.body = await ctx.service.article.findArticleList(ctx.query);
    // }
  }

  async show() {
    const { ctx } = this;
    const article = await ctx.service.article.findById(ctx.params.id);
    if (!article) {
      ctx.throw(404, 'article not found');
    } else {
      ctx.body = article;
      ctx.status = 201;
    }
  }

  async create() {
    const { ctx } = this;
    const user = ctx.state.user;
    // 校验参数
    ctx.validate(this.createArticleRule);

    const article = await ctx.model.Article.create({
      ...ctx.request.body,
      authorId: user.data.id,
    });

    const tags = await this.app.model.Tag.findAll({
      where: {
        name: ctx.request.body.tags,
      },
    });
    await article.setTags(tags);

    const res = await ctx.service.article.findById(article.id);
    ctx.helper.success({ ctx, res });
  }

  async update() {
    const { ctx } = this;
    const user = ctx.state.user;
    const article = await ctx.service.article.findById(ctx.params.id);
    if (!article || article.authorId !== user.data.id) {
      ctx.throw(404, 'article not found');
      return;
    }

    // 校验参数
    ctx.validate(this.createArticleRule);

    await article.update(ctx.request.body);

    const tags = await this.app.model.Tag.findAll({
      where: {
        name: ctx.request.body.tags,
      },
    });
    await article.setTags(tags);

    const res = await ctx.service.article.findById(article.id);
    ctx.helper.success({ ctx, res });
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

  async tags() {
    this.ctx.body = await this.app.model.Tag.findAll({
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
    });
  }

  async categories() {
    this.ctx.body = await this.app.model.Category.findAll({
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
    });
  }
}

module.exports = ArticleController;
