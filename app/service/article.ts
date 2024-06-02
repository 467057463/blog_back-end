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

  async hotArticles() {
    return this.app.model.Article.findAll({
      attributes: {
        include: [
          // [ this.app.Sequelize.fn('COUNT', this.app.Sequelize.col('tag.id')), 'teachers' ],
          // [ this.app.Sequelize.fn('COUNT', this.app.Sequelize.fn('DISTINCT', this.app.Sequelize.col('tags'))), 'pupils' ],
          // [ this.app.Sequelize.fn('COUNT', this.app.Sequelize.col('tags')), 'n_hats' ],
        ],
      },
      include: [
        {
          model: this.app.model.Tag,
          as: 'tags',
        },
      ],
      where: {
        categoryId: 1,
      },
      // order: [
      //   [ 'createdAt', 'DESC' ],
      // ],
      ordeer: [ this.app.Sequelize.literal('rand()') ],
      limit: 10,
      distinct: true,
    });
  }
}

module.exports = Article;
