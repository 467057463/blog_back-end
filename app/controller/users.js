// app/controller/users.js
const Controller = require('egg').Controller;
const stream = require('node:stream');
const util = require('node:util');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const pipeline = util.promisify(stream.pipeline);


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
        const targetPath = path.join(
          uploadDir,
          randomUUID() + path.extname(filename)
        );
        await pipeline(part, fs.createWriteStream(targetPath, { recursive: true }));
        files[fieldname] = targetPath.replace(process.cwd(), '');
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
      const originAvatar = profile.avatar && path.join(process.cwd(), profile.avatar);
      if (originAvatar && fs.existsSync(originAvatar)) {
        fs.rmSync(originAvatar);
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
