const utils = require('../service/utils');
const loginService = require('../service/loginService');

const {
  C_200,
  C_400,
  C_500,
} = utils.statusHttp;

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginService.registerUser(email, password);
    if (token.code400) {
      return res.status(C_400).send({ message: token.message });
    }
    return res.status(C_200).send({ token });
  } catch (error) {
    console.error(error);
      return res
        .status(C_500)
        .json({ message: error.message });
  }
};

module.exports = {
  registerUser,
};