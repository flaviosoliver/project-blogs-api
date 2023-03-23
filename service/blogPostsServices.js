const jwt = require('jsonwebtoken');
const utils = require('./utils');
const { BlogPost, Category, User } = require('../models');

const {
  C400TitleRequired,
  C400ContentRequired,
  C400CategoryIdRequired,
  C400CategoryIdNotFound,
  C404PostNotExist,
  C400CategoriesNotEdited,
  C401UserNotAuth,
} = utils.errorMessage;

const { secret } = utils;

const countZero = 0;

const titleExistis = (title) => {
  if (title === ''
  || title === undefined) {
    return false;
  }
  return true;
};

const contentExistis = (content) => {
  if (content === ''
  || content === undefined) {
    return false;
  }
  return true;
};

const categoryExistis = (category) => {
  if (category === ''
  || category === undefined) {
    return false;
  }
  return true;
};

const verifyRequired = (title, content, categoryIds) => {
  if (!titleExistis(title)) {
    return { code400: true, message: C400TitleRequired };
  }
  if (!contentExistis(content)) {
    return { code400: true, message: C400ContentRequired };
  }
  if (!categoryExistis(categoryIds)) {
    return { code400: true, message: C400CategoryIdRequired };
  }
  return true;
};

const verifyCategory = async (categoryIds) => {
  const id = categoryIds;
  const findCategoryId = await Category.findAndCountAll({ where: { id } });
  if (findCategoryId.count > countZero) {
    return findCategoryId.count;
  }
  return countZero;
};

const verifyRequiredInUpdate = (title, content) => {
  if (!titleExistis(title)) {
    return { code400: true, message: C400TitleRequired };
  }
  if (!contentExistis(content)) {
    return { code400: true, message: C400ContentRequired };
  }
  return true;
};

const postExistis = async (id) => {
  const post = await BlogPost.findByPk(id);
  if (!post) {
    return false;
  }
  return post;
};

const catchUser = (req) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, secret);
  const { userId } = decoded.data;
  return userId;
};

const categoryBeing = (req) => {
  const { categoryIds } = req.body;
  if (categoryIds) {
    return true;
  }
  return false;
};

const createPost = async (req) => {
  const { title, content, categoryIds } = req.body;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, secret);
  const { userId } = decoded.data;
  const checkRequired = verifyRequired(title, content, categoryIds);
  if (checkRequired !== true) {
    return checkRequired;
  }
  const checkCategoryId = await verifyCategory(categoryIds);
  if ((checkCategoryId === categoryIds.length) !== true) {
    return { code400: true, message: C400CategoryIdNotFound };
  }
  const post = await BlogPost.create({ title, content, userId });
  return post;
};

const getAllPosts = async () => {
  const posts = await BlogPost.findAll({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ] });
  return posts;
};

const getPostById = async (req) => {
  const { id } = req.params;
  const post = await postExistis(id);
  if (!post) {
    return { code404: true, message: C404PostNotExist };
  }
  const { dataValues: postById } = await BlogPost.findOne({
    where: { id },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
  return postById;
};

const updatePost = async (req) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = catchUser(req);
  const checkCategoriesExist = categoryBeing(req);
  if (checkCategoriesExist) {
    return { code400: true, message: C400CategoriesNotEdited };
  }
  const checkRequired = verifyRequiredInUpdate(title, content);
  if (checkRequired !== true) { return checkRequired; }
  const post = await BlogPost.findByPk(id);
  if (post.userId !== userId) {
    return { code401: true, message: C401UserNotAuth };
  }
  const [update] = await BlogPost.update({ title, content }, {
    where: { id: req.params.id } });
  const updatedPost = await BlogPost.findByPk(update,
    { include: [{ model: Category, as: 'categories' }] });
  return updatedPost;
};

const deletePost = async (req) => {
  const { id } = req.params;
  const userId = catchUser(req);
  const post = await postExistis(id);
  if (!post) {
    return { code404: true, message: C404PostNotExist };
  }
  const selectPost = await BlogPost.findByPk(id);
  if (selectPost.userId !== userId) {
    return { code401: true, message: C401UserNotAuth };
  }
  const postDelected = await BlogPost.destroy({ where: { id } });
  return postDelected;
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};