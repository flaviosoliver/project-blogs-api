const express = require('express');

const router = express.Router();
const blogPostsController = require('../controller/BlogPostsController');
const middleware = require('../middleware');

const { validateTokenMiddleware } = middleware;

router.post('/post',
  validateTokenMiddleware,
  blogPostsController.createBlogPost);

router.get('/post',
  validateTokenMiddleware,
  blogPostsController.getAllPosts);

router.get('/post/:id',
  validateTokenMiddleware,
  blogPostsController.getPostById);

router.put('/post/:id',
  validateTokenMiddleware,
  blogPostsController.updatePost);

router.delete('/post/:id',
  validateTokenMiddleware,
  blogPostsController.deletePost);

module.exports = router;