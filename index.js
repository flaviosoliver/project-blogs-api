const express = require('express');

const middlewares = require('./middleware');
const routes = require('./routes');

const app = express();

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.use(express.json());
app.use(middlewares.logMiddleware);
app.use(routes.userRoutes);
app.use(routes.loginRoutes);
app.use(routes.categoriesRoutes);
app.use(routes.blogPostsRoutes);

app.listen(3003, () => console.log('ouvindo porta 3003!'));