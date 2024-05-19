import { Controller } from 'egg';

export default class DraftController extends Controller {

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
    };
  }

  get draftRule() {
    return {
      title: {
        type: 'string',
        required: false,
      },
      content: {
        type: 'string',
        required: false,
      },
      articleId: {
        type: 'int',
        required: false,
      },
    };
  }

  async index() {
    const { ctx } = this;
    // 校验参数
    ctx.validate(this.indexQueryRule, ctx.query);

    const currentUser = ctx.state.user.data.id;

    const res = await ctx.model.Draft.findAll({
      where: {
        authorId: currentUser,
      },
    });

    ctx.helper.success({
      ctx,
      res,
    });
  }

  async create() {
    const { ctx } = this;
    // 校验参数
    ctx.validate(this.draftRule);
    // 组装参数
    const payload = ctx.request.body || {};

    const currentUser = ctx.state.user.data.id;

    // 创建
    const draft = await ctx.model.Draft.create({
      ...payload,
      authorId: currentUser,
    });

    ctx.helper.success({ ctx, res: draft, msg: '草稿创建成功' });
  }

  async update() {
    const { ctx } = this;
    // 校验参数
    ctx.validate(this.draftRule);
    // 组装参数
    const payload = ctx.request.body || {};

    const currentUser = ctx.state.user.data.id;

    const draft = await ctx.model.Draft.findByPk(ctx.params.id);

    if (!draft || draft.authorId !== currentUser) {
      ctx.throw(404, 'drafts not found');
      return;
    }

    await draft.update({
      ...payload,
      authorId: currentUser,
    });

    ctx.helper.success({ ctx, res: draft, msg: '草稿更新成功' });
  }

  async show() {
    const { ctx } = this;
    const currentUser = ctx.state.user.data.id;
    const draft = await ctx.model.Draft.findByPk(ctx.params.id, {
      include: [
        {
          model: ctx.model.Article,
          as: 'article',
          attributes: {
            exclude: [ 'createdAt', 'updatedAt' ],
          },
          include: {
            model: this.ctx.model.Tag,
            as: 'tags',
            attributes: {
              exclude: [ 'createdAt', 'updatedAt' ],
            },
            through: {
              attributes: [],
            },
          },
        },
      ],
    });

    if (!draft || draft.authorId !== currentUser) {
      ctx.throw(404, 'drafts not found');
      return;
    }

    ctx.helper.success({
      ctx,
      res: draft,
    });
  }

  async destroy() {
    const { ctx } = this;
    const user = ctx.state.user;

    const draft = await ctx.model.Draft.findByPk(ctx.params.id);

    if (!draft || draft.authorId !== user.data.id) {
      ctx.throw(404, 'draft not found');
      return;
    }

    await draft.destroy();
    ctx.helper.success({
      ctx,
      msg: '删除成功',
    });
  }
}
