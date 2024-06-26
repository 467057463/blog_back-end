// app/controller/users.js
const Controller = require('egg').Controller;
const stream = require('node:stream');
const util = require('node:util');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const pipeline = util.promisify(stream.pipeline);
const { sendToWormhole } = require('stream-wormhole');

class UserController extends Controller {

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

    for await (const part of parts) {
      if (Array.isArray(part)) {
        fields[part[0]] = part[1];
      } else {
        const { filename, fieldname } = part;
        try {
          const result = await this.app.oss.put(
            `blog_data_${this.app.env}/${randomUUID()}${path.extname(filename)}`,
            part
          );
          files[fieldname] = result.name;
        } catch (error) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          ctx.throw(error);
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
        this.ctx.oss.delete(originAvatar);
      }
      await profile.update({
        ...fields,
        ...files,
        user_id: currentUser,
      });
    }
    ctx.helper.success({ ctx, res: await user.getProfile(), msg: '更新成功' });
  }
}

module.exports = UserController;
