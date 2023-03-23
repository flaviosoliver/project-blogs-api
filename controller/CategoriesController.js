const utils = require('../service/utils');
const categoriesService = require('../service/categoriesService');

const {
  C_200, C_201, C_400, C_500,
} = utils.statusHttp;

const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await categoriesService.createCategory(name);
    console.log('category controller', category);
    if (category.code400) {
      return res
        .status(C_400)
        .send({ message: category.message });
    }
    return res
      .status(C_201)
      .send(category);
  } catch (error) {
    console.error(error);
      return res
        .status(C_500)
        .json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoriesService.getAllCategories();
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

module.exports = {
  createCategory,
  getAllCategories,
};