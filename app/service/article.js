const { Service } = require('egg');

class Article extends Service {

  async findArticleList({ page = 1, limit = 10 }) {
    return this.app.model.Article.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      include: {
        model: this.ctx.model.User,
        as: 'author',
        all: true,
        nested: true,
        attributes: {
          exclude: [ 'password', 'createdAt', 'updatedAt' ],
        },
      },
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
      include: {
        model: this.ctx.model.User,
        as: 'author',
        all: true,
        nested: true,
        attributes: {
          exclude: [ 'password', 'createdAt', 'updatedAt' ],
        },
      },
    });
  }
}

module.exports = Article;
