const jwt = require('jsonwebtoken');
const utils = require('./utils');
const { User } = require('../models');

const {
  C400DisplayName,
  C400EmailValid,
  C400EmailRequired,
  C400PasswordLength,
  C400PasswordRequired,
  C409,
  C404UserNotExist,
} = utils.errorMessage;

const { secret } = utils;

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

const emailExistis = (email) => {
  if (email === '' || email === undefined) {
    return false;
  }
  return true;
};

const displayNameLength = (displayName) => {
  if (displayName.length < 8) {
      return false;
    }
    return true;
};

const displayNameExistis = (displayName) => {
  if (displayName === ''
  || displayName === undefined) {
    return false;
  }
  return true;
};

const passwordExistis = (password) => {
  if (password === ''
  || password === undefined) {
    return false;
  }
  return true;
};

const passwordLength = (password) => {
  if (password.length < 6) {
      return false;
  }
  return true;
};

const verifyCountEmail = async (email) => {
  const countEmail = await User.findOne({ where: { email } });
  if (countEmail) {
    return true;
  }
  return false;
};

const verifyRequired = (password, email, displayName) => {
  if (!passwordExistis(password)) {
    return { code400: true, message: C400PasswordRequired };
  }
  if (!emailExistis(email)) {
    return { code400: true, message: C400EmailRequired };
  }
  if (!validateEmail(email)) {
    return { code400: true, message: C400EmailValid };
  }
  if (!displayNameExistis(displayName)) {
    return { code400: true, message: C400DisplayName };
  }
  return true;
};

const verifyLength = (password, displayName) => {
  if (!passwordLength(password)) {
    return { code400: true, message: C400PasswordLength };
  }
  if (!displayNameLength(displayName)) {
    return { code400: true, message: C400DisplayName };
  }
  return true;
};

const catchUser = (req) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, secret);
  const { userId } = decoded.data;
  return userId;
};

const create = async (displayName, email, password, image) => {
  const checkRequired = verifyRequired(password, email, displayName);
  if (checkRequired !== true) {
    return checkRequired;
  }
  const checkLength = verifyLength(password, displayName);

  if (await verifyCountEmail(email) === true) {
    return { code409: true, message: C409 };
  }
  if (checkLength !== true) {
    return checkLength;
  }
  const user = await User.create({ displayName, email, password, image });
  const token = utils.generateToken(user.id, user.email, user.password);
  return token;
};

const getAllUsers = async () => {
  const users = await User.findAll();
  if (!users) {
    return {
      code500: true, message: 'It was not possible to complete your request.',
    };
  }
  return users;
};

const getUserById = async (id) => {
  const result = await User.findOne({ where: { id } });
  if (!result) {
      return {
        code404: true, message: C404UserNotExist,
      };
  }
  return result;
};

const deleteUser = async (req) => {
  const userId = catchUser(req);
  await User.destroy({ where: { id: userId } });
};

module.exports = {
  create,
  getAllUsers,
  getUserById,
  deleteUser,
};
