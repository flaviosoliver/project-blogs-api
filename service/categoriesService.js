const utils = require('./utils');
const { Category } = require('../models');

const {
  C400NameRequired,
} = utils.errorMessage;

const nameExistis = (name) => {
  if (name === ''
  || name === undefined) {
    return false;
  }
  return true;
};

const createCategory = async (name) => {
  const nameCheck = nameExistis(name);
  console.log('nameCheck service', nameCheck);
  console.log('name', name);
  if (nameCheck !== true) {
    return { code400: true, message: C400NameRequired };
  }
  const category = await Category.create({ name });
  console.log('category service', category);
  return category;
};

const getAllCategories = async () => {
  const categories = await Category.findAll();
  return categories;
};

module.exports = {
  createCategory,
  getAllCategories,
};