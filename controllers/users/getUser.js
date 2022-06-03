const existUser = require("../../db/existUser");
const postList = require("../../db/postList");

const getUser = async (req, res, next) => {
  try {
    const { userName } = req.params;

    const [userData] = await existUser(userName);

    const list = await postList(userData.id);

    console.log("---->>", list);

    res.send({
      status: "ok",
      message: list,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
