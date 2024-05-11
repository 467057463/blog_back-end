import { Service } from 'egg';


export default class Article extends Service {

  async findArticleList({ tag, categoryId, page = 1, limit = 10 }) {
    const where = {} as any;
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (tag) {
      where['$tags.name$'] = tag;
    }
    return this.app.model.Article.findAndCountAll({
      include: [
        {
          model: this.ctx.model.User,
          as: 'author',
          attributes: {
            exclude: [ 'password', 'createdAt', 'updatedAt' ],
          },
          include: {
            model: this.ctx.model.Profile,
            as: 'profile',
          },
        },
        {
          model: this.ctx.model.Tag,
          as: 'tags',
          attributes: {
            exclude: [ 'createdAt', 'updatedAt' ],
          },
          through: {
            attributes: [],
          },
        },
      ],
      subQuery: false,
      where,
      limit,
      offset: (page - 1) * limit,
      order: [
        [ 'createdAt', 'DESC' ],
      ],
    }).then(({ count, rows }) => {
      return {
        list: rows,
        count,
        currentPage: page,
        limit,
        pages: Math.ceil(count / limit),
      };
    });
  }

  async findById(id) {
    return this.app.model.Article.findByPk(id, {
      include: [
        {
          model: this.ctx.model.User,
          as: 'author',
          attributes: {
            exclude: [ 'password', 'createdAt', 'updatedAt' ],
          },
          include: {
            model: this.ctx.model.Profile,
            as: 'profile',
          },
        },
        {
          model: this.ctx.model.Tag,
          as: 'tags',
          attributes: {
            exclude: [ 'createdAt', 'updatedAt' ],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: this.ctx.model.Draft,
          as: 'draft',
          attributes: {
            exclude: [ 'createdAt', 'updatedAt' ],
          },
        },
      ],
    });
  }

  async findArticleByTag({ tag }) {
    return this.app.model.Tag.findOne({
      where: {
        name: tag,
      },
      include: {
        model: this.ctx.model.Article,
        nested: true,
        all: true,
      },
    });
  }
}

module.exports = Article;
