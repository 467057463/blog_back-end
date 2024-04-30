import { Controller } from 'egg';

export default class ArticleController extends Controller {
  get indexQueryRule() {
    return {
      limit: {
        type: 'int',
        default: 10,
        required: false,
      },
      page: {
        type: 'int',
        default: 1,
        required: false,
      },
      categoryId: {
        type: 'int',
        default: 1,
        required: false,
      },
      tag: {
        type: 'string',
        required: false,
        default: '',
      },
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

    ctx.helper.success({
      ctx,
      res: await ctx.service.article.findArticleList(ctx.query as any),
    });
  }

  async show() {
    const { ctx } = this;
    const article = await ctx.service.article.findById(ctx.params.id);
    if (!article) {
      ctx.throw(404, 'article not found');
    } else {
      ctx.helper.success({
        ctx,
        res: article,
      });
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
      ctx.throw(404, 'article not found');
      return;
    }

    await article.setTags([]);
    await article.destroy();
    ctx.helper.success({
      ctx,
      msg: '删除成功',
    });
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

    await article.addLikeUser(user);
    ctx.helper.success({
      ctx,
      msg: '点赞成功',
    });
  }

  async tags() {
    const { ctx } = this;
    const res = await this.app.model.Tag.findAll({
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
    });
    ctx.helper.success({
      ctx,
      res,
    });
  }

  async categories() {
    const { ctx } = this;
    const res = await this.app.model.Category.findAll({
      attributes: {
        exclude: [ 'createdAt', 'updatedAt' ],
      },
    });
    ctx.helper.success({
      ctx,
      res,
    });
  }
}
