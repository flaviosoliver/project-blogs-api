const jwt = require('jsonwebtoken');
const { User } = require('../models');
const utils = require('../service/utils');

const { secret } = utils;
console.log('secret middleware', secret);

const {
  C_401,
} = utils.statusHttp;

const {
  C401TokenInvalid,
  C401TokenNotFound,
} = utils.errorMessage;

const validateTokenMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(C_401).json({ message: C401TokenNotFound });
  }
  try {
    const decoded = jwt.verify(token, secret);
    const { email } = decoded.data;
    await User.findOne({ where: { email } });
    next();
  } catch (error) {
    return res.status(C_401).json({ message: C401TokenInvalid });
  }
};

module.exports = validateTokenMiddleware;