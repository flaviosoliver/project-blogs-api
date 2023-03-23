const express = require('express');

const router = express.Router();
const loginController = require('../controller/LoginController');

// const {  } = middlewares;

router.post('/login',
  loginController.registerUser);

// router.get('/users', );

// router.get('/users/:id', );

// router.put('/users/:id', );

// router.delete('/users/:id', );

module.exports = router;