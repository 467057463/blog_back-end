/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', app.jwt, controller.home.index);
  router.post('/login', controller.auth.login);
  router.post('/register', controller.auth.register);

  router.get('/articles', controller.articles.index);
  router.post('/articles', app.jwt, controller.articles.create);
  // router.resources('users', '/users', controller.users);
};
