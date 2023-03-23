const utils = require('../service/utils');
const blogPostsServices = require('../service/blogPostsServices');

const {
  C_200, C_201, C_204, C_400, C_401, C_404, C_500,
} = utils.statusHttp;

const createBlogPost = async (req, res) => {
  try {
    const post = await blogPostsServices.createPost(req);
    if (post.code400) {
      return res.status(C_400).send({ message: post.message });
    }
    return res.status(C_201).send(post);
  } catch (error) {
    console.error(error);
    return res.status(C_500).json({ message: error.message });
}
};

const getAllPosts = async (req, res) => {
  try {
    const categories = await blogPostsServices.getAllPosts();
    return res
      .status(C_200)
      .send(categories);
  } catch (error) {
    console.error(error);
    return res
      .status(C_500)
      .json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await blogPostsServices.getPostById(req);
    if (post.code404) {
      return res
        .status(C_404)
        .send({ message: post.message });
    }
    return res
      .status(C_200)
      .send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(C_500)
      .json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await blogPostsServices.updatePost(req);
    if (post.code400) {
      return res.status(C_400).send({ message: post.message });
    }
    if (post.code401) {
      return res.status(C_401).send({ message: post.message });
    }
    return res.status(C_200).send(post);
  } catch (error) {
    console.error(error);
    return res.status(C_500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await blogPostsServices.deletePost(req);
    if (post.code401) {
      return res.status(C_401).send({ message: post.message });
    }
    if (post.code404) {
      return res.status(C_404).send({ message: post.message });
    }
    return res.status(C_204).send();
  } catch (error) {
    console.error(error);
    return res.status(C_500).json({ message: error.message });
  }
};

module.exports = {
  createBlogPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};