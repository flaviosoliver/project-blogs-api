const utils = require('./utils');
const { User } = require('../models');

const {
  C400EmailRequired,
  C400PasswordRequired,
  C400EmailNotAllow,
  C400PasswordNotAllow,
  C400InvalidFields,
} = utils.errorMessage;

const passwordAllow = (password) => {
  if (password === '') {
    return false;
  }
  return true;
};

const emailAllow = (email) => {
  if (email === '') {
    return false;
  }
  return true;
};

const fieldsAllow = (email, password) => {
  if (!passwordAllow(password)) {
    return { code400: true, message: C400PasswordNotAllow };
  }
  if (!emailAllow(email)) {
    return { code400: true, message: C400EmailNotAllow };
  }
  return true;
};

const emailExistis = (email) => {
  if (email === undefined) {
    return false;
  }
  return true;
};

const passwordExistis = (password) => {
  if (password === undefined) {
    return false;
  }
  return true;
};

const fieldsExistis = (email, password) => {
  if (!passwordExistis(password)) {
    return { code400: true, message: C400PasswordRequired };
  }
  if (!emailExistis(email)) {
    return { code400: true, message: C400EmailRequired };
  }
  return true;
};

const verifyCountEmail = async (email) => {
  const countEmail = await User.findOne({ where: { email } });
  if (countEmail) {
    return countEmail;
  }
  return false;
};

const registerUser = async (email, password) => {
  const checkExistis = fieldsExistis(email, password);
  if (checkExistis !== true) {
    return checkExistis;
  }
  const checkAllow = fieldsAllow(email, password);
  if (checkAllow !== true) {
    return checkAllow;
  }
  const user = await verifyCountEmail(email);
  if (user === false) {
    return { code400: true, message: C400InvalidFields };
  }
  const token = utils.generateToken(user.id, user.email, user.password);
  return token;
};

module.exports = {
  registerUser,
};