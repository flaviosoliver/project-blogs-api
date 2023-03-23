const utils = require('../service/utils');
const usersService = require('../service/usersService');

const {
  C_200, C_201, C_204, C_400, C_404, C_409, C_500,
} = utils.statusHttp;

const createUser = async (req, res) => {
  const { displayName, email, password, image } = req.body;
  try {
    const user = await usersService.create(displayName, email, password, image);
    if (user.code400) {
      return res.status(C_400).send({ message: user.message });
    }
    if (user.code409) {
      return res.status(C_409).send({ message: user.message });
    }
    return res.status(C_201).send({ user });
  } catch (error) {
    console.error(error);
      return res
        .status(C_500)
        .json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    return res
      .status(C_200)
      .send(users);
  } catch (error) {
    console.error(error);
    return res
      .status(C_500)
      .json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserById(id);
    if (user.code404) {
      return res
        .status(C_404)
        .send({ message: user.message });
    }
    return res
      .status(C_200)
      .send(user);
  } catch (error) {
    console.error(error);
    return res
      .status(C_500)
      .json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await usersService.deleteUser(req);
    return res.status(C_204).send();
  } catch (error) {
    console.error(error);
    return res.status(C_500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
};