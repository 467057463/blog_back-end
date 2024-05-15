import { Controller } from 'egg';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { sendToWormhole } from 'stream-wormhole';

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
    const { ctx, app } = this;
    const parts = ctx.multipart();
    const currentUser = ctx.state.user.data.id;
    const fields = {};
    const files = {};

    for await (const part of parts as any) {
      console.log('part', part);
      if (Array.isArray(part)) {
        if (fields[part[0]]) {
          fields[part[0]] = [
            ...fields[part[0]],
            part[1],
          ];
        } else {
          fields[part[0]] = part[1];
        }
      } else {
        const { filename, fieldname } = part;
        try {
          const result = await ctx.oss.put(
            `blog_data_${this.app.env}/${randomUUID()}${path.extname(
              filename,
            )}`,
            part,
          );
          files[fieldname] = result.name;
        } catch (error) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          ctx.throw(error as any);
        }
      }
    }


    // 校验参数
    app.validator.validate(this.createArticleRule, {
      ...fields,
      ...files,
    });

    const article = await ctx.model.Article.create({
      ...fields,
      ...files,
      authorId: currentUser,
    });

    const tags = await this.app.model.Tag.findAll({
      where: {
        id: (fields as any).tags,
      },
    });
    await article.setTags(tags);

    const articleRes = await ctx.service.article.findById(article.id);
    if (articleRes.draft) {
      await articleRes.setDraft(null);
      await ctx.model.Draft.destroy({
        where: {
          id: articleRes.draft.id,
        },
      });
    }
    ctx.helper.success({ ctx, res: articleRes });
  }

  async update() {
    const { ctx, app } = this;
    const parts = ctx.multipart();
    const currentUser = ctx.state.user.data.id;
    const fields = {};
    const files = {};

    const article = await ctx.service.article.findById(ctx.params.id);
    if (!article || article.authorId !== currentUser) {
      ctx.throw(404, 'article not found');
      return;
    }

    for await (const part of parts as any) {
      console.log('part', part);
      if (Array.isArray(part)) {
        if (fields[part[0]]) {
          fields[part[0]] = [
            ...fields[part[0]],
            part[1],
          ];
        } else {
          fields[part[0]] = part[1];
        }
      } else {
        const { filename, fieldname } = part;
        try {
          const result = await ctx.oss.put(
            `blog_data_${this.app.env}/${randomUUID()}${path.extname(
              filename,
            )}`,
            part,
          );
          files[fieldname] = result.name;
        } catch (error) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          ctx.throw(error as any);
        }
      }
    }

    // 校验参数
    app.validator.validate(this.createArticleRule, {
      ...fields,
      ...files,
    });

    const originCover = article.cover;
    if (originCover && (files as any).cover) {
      await ctx.oss.delete(originCover.replace(this.config.IMG_HOST, ''));
    }

    await article.update({
      ...fields,
      ...files,
    });

    const tags = await this.app.model.Tag.findAll({
      where: {
        id: (fields as any).tags,
      },
    });
    await article.setTags(tags);

    const articleRes = await ctx.service.article.findById(article.id);
    if (articleRes.draft) {
      await articleRes.setDraft(null);
      await ctx.model.Draft.destroy({
        where: {
          id: articleRes.draft.id,
        },
      });
    }
    ctx.helper.success({ ctx, res: articleRes });
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
