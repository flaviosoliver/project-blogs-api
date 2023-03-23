const express = require('express');

const router = express.Router();
const usersController = require('../controller/UsersController');
const middleware = require('../middleware');

const { validateTokenMiddleware } = middleware;

router.post('/user',
  usersController.createUser);

router.get('/user',
  validateTokenMiddleware,
  usersController.getAllUsers);

router.get('/user/:id',
validateTokenMiddleware,
usersController.getUserById);

// router.put('/user/:id', );

router.delete('/user/me',
validateTokenMiddleware,
usersController.deleteUser);

module.exports = router;