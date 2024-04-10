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
    const { ctx, app } = this;
    const parts = ctx.multipart();
    const currentUser = ctx.state.user.data.id;

    const fields = {};
    const files = {};

    const uploadDir = path.join(process.cwd(), 'upload');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    for await (const part of parts) {
      console.log('part===============');
      console.log(part);
      if (Array.isArray(part)) {
        fields[part[0]] = part[1];
      } else {
        const { filename, fieldname, encoding, mime } = part;
        // const targetPath = path.join(
        //   uploadDir,
        //   randomUUID() + path.extname(filename)
        // );
        // await pipeline(part, fs.createWriteStream(targetPath, { recursive: true }));
        // files[fieldname] = targetPath.replace(process.cwd(), '');
        // let result;
        try {
          // console.log(sssss);
          const result = await this.app.oss.put(
            'blog_data/' + randomUUID() + path.extname(filename),
            part
          );
          files[fieldname] = 'https://img.mmisme.cn/' + result.name;
          // files[fieldname] = result.url;
        } catch (error) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          ctx.throw(error);
        }

      }
    }
    console.log(fields);
    console.log(files);
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
        this.ctx.oss.delete(originAvatar.replace('https://img.mmisme.cn/', ''));
      }
      await profile.update({
        ...fields,
        ...files,
        user_id: currentUser,
      });
    }
    // ctx.body = await user.getProfile();
    ctx.helper.success({ ctx, res: await user.getProfile(), msg: '更新成功' });
  }
}

module.exports = UserController;
