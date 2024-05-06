// app/controller/users.js
import { Controller } from 'egg';
// import stream from 'node:stream';
// import util from 'node:util';
import { randomUUID } from 'node:crypto';
// import fs from 'node:fs';
import path from 'node:path';
// const pipeline = util.promisify(stream.pipeline);
import { sendToWormhole } from 'stream-wormhole';

export default class UserController extends Controller {
  async show() {
    const ctx = this.ctx;
    // 延迟加载
    // const user = await ctx.model.User.findByPk(ctx.params.id);
    // ctx.body = await user.getArticles();

    // 预加载
    ctx.body = await ctx.model.User.findByPk(ctx.params.id, {
      include: [
        {
          model: this.ctx.model.Article,
          as: 'articles',
          attributes: {
            exclude: [ 'author_id', 'authorId' ],
          },
        },
        {
          model: this.ctx.model.Profile,
          as: 'profile',
        },
        {
          model: this.ctx.model.Article,
          as: 'likeArticles',
          attributes: {
            exclude: [ 'author_id', 'authorId' ],
          },
        },
      ],
    });
  }

  async updateProfile() {
    const { ctx } = this;
    const parts = ctx.multipart();
    const currentUser = ctx.state.user.data.id;
    const fields = {};
    const files = {};

    for await (const part of parts as any) {
      if (Array.isArray(part)) {
        fields[part[0]] = part[1];
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
    const user = await this.app.model.User.findByPk(currentUser);
    const profile = await user.getProfile();
    if (!profile) {
      await user.createProfile({
        ...fields,
        ...files,
        user_id: currentUser,
      });
    } else {
      const originAvatar = profile.avatar;
      if (originAvatar) {
        await ctx.oss.delete(originAvatar.replace(this.config.IMG_HOST, ''));
      }
      await profile.update({
        ...fields,
        ...files,
        user_id: currentUser,
      });
    }
    ctx.helper.success({ ctx, res: await user.getProfile(), msg: '更新成功' });
  }

  async getUserInfo() {
    const { ctx } = this;
    const currentUser = ctx.state.user.data.id;
    if (!currentUser) {
      ctx.throw(404, '请求错误');
      return;
    }
    const user = await this.app.model.User.findByPk(currentUser, {
      include: [
        {
          model: this.ctx.model.Profile,
          as: 'profile',
          attributes: {
            exclude: [ 'createdAt', 'updatedAt', 'user_id' ],
          },
        },
      ],
      attributes: {
        exclude: [ 'createdAt', 'updatedAt', 'password' ],
      },
    });
    if (!user) {
      ctx.throw(404, '请求错误');
      return;
    }
    // return user;
    ctx.helper.success({ ctx, res: user });
  }
}
