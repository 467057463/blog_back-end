import { Controller } from 'egg';

export default class DraftController extends Controller {

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
}
