// app/controller/users.js
const Controller = require('egg').Controller;
const stream = require('node:stream');
const util = require('node:util');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const pipeline = util.promisify(stream.pipeline);

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserController extends Controller {
  // async index() {
  //   const ctx = this.ctx;
  //   const query = {
  //     limit: toInt(ctx.query.limit),
  //     offset: toInt(ctx.query.offset),
  //   };
  //   ctx.body = await ctx.model.User.findAll(query);
  // }


  // async create() {
  //   const ctx = this.ctx;
  //   const { name, age } = ctx.request.body;
  //   const user = await ctx.model.User.create({ name, age });
  //   ctx.status = 201;
  //   ctx.body = user;
  // }

  // async update() {
  //   const ctx = this.ctx;
  //   const id = toInt(ctx.params.id);
  //   const user = await ctx.model.User.findByPk(id);
  //   if (!user) {
  //     ctx.status = 404;
  //     return;
  //   }

  //   const { name, age } = ctx.request.body;
  //   await user.update({ name, age });
  //   ctx.body = user;
  // }

  // async destroy() {
  //   const ctx = this.ctx;
  //   const id = toInt(ctx.params.id);
  //   const user = await ctx.model.User.findByPk(id);
  //   if (!user) {
  //     ctx.status = 404;
  //     return;
  //   }

  //   await user.destroy();
  //   ctx.status = 200;
  // }


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

    // 一对一关联 直接设置null, 不会删除该条记录
    // const u = await this.app.model.User.findByPk(currentUser);
    // u.setProfile(null);
    // ctx.body = 'success';
    // return;

    const fields = {};
    const files = {};

    const uploadDir = path.join(process.cwd(), 'upload');
    if (!fs.existsSync) {
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
    const user = await this.app.model.User.findByPk(currentUser, {
      include: {
        model: this.app.model.Profile,
        as: 'profile',
      },
    });
    const profile = await user.getProfile();
    if (!profile) {
      await user.createProfile({ ...fields, ...files, user_id: currentUser });
    } else {
      const originAvatar = path.join(process.cwd(), profile.avatar);
      if (fs.existsSync(originAvatar)) {
        fs.rmSync(originAvatar);
      }
      await profile.update({ ...fields, ...files, user_id: currentUser });
    }
    ctx.body = await user.getProfile();
  }
}

module.exports = UserController;
