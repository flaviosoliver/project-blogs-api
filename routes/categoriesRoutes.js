const express = require('express');

const router = express.Router();
const categoriesController = require('../controller/CategoriesController');
const middleware = require('../middleware');

const { validateTokenMiddleware } = middleware;

router.post('/categories',
  validateTokenMiddleware,
  categoriesController.createCategory);

router.get('/categories',
  validateTokenMiddleware,
  categoriesController.getAllCategories);

// router.get('/categories/:id', );

// router.put('/categories/:id', );

// router.delete('/categories/:id', );

module.exports = router;